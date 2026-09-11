import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, CalendarDays, CheckCircle2, Code2, Flame, Trophy } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/ui/Navbar';

const dayKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStreak = (activity) => {
  const activeDays = new Set(Object.keys(activity));
  if (!activeDays.size) return 0;
  const cursor = new Date();
  if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activeDays.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

function ActivityCalendar({ activity }) {
  const weeks = useMemo(() => {
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (26 * 7 - 1));
    return Array.from({ length: 26 }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
      const count = activity[dayKey(date)] || 0;
      return { date, count, future: date > new Date() };
    }));
  }, [activity]);

  const level = (count) => count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;

  return (
    <div className="cc-calendar-wrap">
      <div className="cc-calendar-days" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
      <div className="cc-calendar" aria-label="Submission activity for the last six months">
        {weeks.map((week, weekIndex) => <div className="cc-calendar-week" key={weekIndex}>{week.map(({ date, count, future }) => <span key={date.toISOString()} className={`cc-calendar-cell cc-heat-${future ? 0 : level(count)}`} title={future ? '' : `${count} submission${count === 1 ? '' : 's'} on ${date.toLocaleDateString()}`} />)}</div>)}
      </div>
    </div>
  );
}

function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [problemResponse, solvedResponse] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/problemSolvedByUser'),
        ]);
        const problemList = Array.isArray(problemResponse.data) ? problemResponse.data : [];
        const histories = await Promise.all(problemList.map(async (problem) => {
          try {
            const response = await axiosClient.get(`/problem/submittedProblem/${problem._id}`);
            return (Array.isArray(response.data) ? response.data : []).map((submission) => ({ ...submission, problemTitle: problem.title }));
          } catch { return []; }
        }));
        if (active) {
          setProblems(problemList);
          setSolved(Array.isArray(solvedResponse.data) ? solvedResponse.data : []);
          setSubmissions(histories.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (error) {
        console.error('Unable to load progress:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const activity = useMemo(() => submissions.reduce((days, submission) => {
    if (submission.createdAt) days[dayKey(submission.createdAt)] = (days[dayKey(submission.createdAt)] || 0) + 1;
    return days;
  }, {}), [submissions]);

  const difficulty = useMemo(() => ['easy', 'medium', 'hard'].map((name) => ({
    name,
    solved: solved.filter((problem) => problem.difficulty?.toLowerCase() === name).length,
    total: problems.filter((problem) => problem.difficulty?.toLowerCase() === name).length,
  })), [problems, solved]);

  const accepted = submissions.filter((submission) => submission.status === 'accepted').length;
  const acceptance = submissions.length ? Math.round((accepted / submissions.length) * 100) : 0;

  return (
    <div className="cc-app-shell">
      <Navbar />
      <main className="cc-page cc-profile-page">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="cc-profile-header cc-panel">
          <div className="cc-profile-identity"><div className="cc-profile-avatar">{user?.firstName?.charAt(0)?.toUpperCase() || 'U'}</div><div><p className="cc-eyebrow">CodeCraft member</p><h1>{user?.firstName || 'User'}</h1><p>{user?.emailId}</p></div></div>
          <div className="cc-profile-metrics">
            <div><Code2 size={17} /><strong>{submissions.length}</strong><span>Submissions</span></div>
            <div><Flame size={17} /><strong>{getStreak(activity)}</strong><span>Day streak</span></div>
            <div><CalendarDays size={17} /><strong>{Object.keys(activity).length}</strong><span>Active days</span></div>
          </div>
        </motion.section>

        <section className="cc-profile-grid">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="cc-panel cc-solved-panel">
            <div className="cc-panel-title-row"><div><p className="cc-eyebrow">Problem solving</p><h2>Solved problems</h2></div><Trophy size={18} className="cc-accent-icon" /></div>
            <div className="cc-solved-summary"><div className="cc-progress-ring cc-progress-ring-small" style={{ '--progress': `${problems.length ? (solved.length / problems.length) * 360 : 0}deg` }}><div><strong>{solved.length}</strong><span>of {problems.length}</span></div></div><div className="cc-difficulty-breakdown">{difficulty.map((item) => <div key={item.name}><span className={`cc-difficulty cc-difficulty-${item.name}`}>{item.name}</span><strong>{item.solved}<small> / {item.total}</small></strong><div><i style={{ width: `${item.total ? (item.solved / item.total) * 100 : 0}%` }} /></div></div>)}</div></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="cc-panel cc-acceptance-panel">
            <p className="cc-eyebrow">Submissions</p><h2>Acceptance</h2><strong className="cc-acceptance-number">{acceptance}%</strong><p>{accepted} accepted out of {submissions.length}</p><div className="cc-acceptance-track"><i style={{ width: `${acceptance}%` }} /></div>
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="cc-panel cc-activity-panel">
          <div className="cc-panel-title-row"><div><p className="cc-eyebrow">Last six months</p><h2>Submission activity</h2></div><div className="cc-calendar-legend"><span>Less</span>{[0, 1, 2, 3, 4].map((value) => <i key={value} className={`cc-heat-${value}`} />)}<span>More</span></div></div>
          {loading ? <div className="cc-calendar-loading" /> : <ActivityCalendar activity={activity} />}
        </motion.section>

        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="cc-panel cc-recent-panel">
          <div className="cc-panel-title-row"><div><p className="cc-eyebrow">Latest work</p><h2>Recent submissions</h2></div><Activity size={18} /></div>
          {loading ? <div className="cc-list-loading" /> : submissions.length ? <div className="cc-recent-list">{submissions.slice(0, 8).map((submission) => <div key={submission._id}><span className={submission.status === 'accepted' ? 'cc-status-solved' : 'cc-status-failed'}>{submission.status === 'accepted' ? <CheckCircle2 size={17} /> : <Code2 size={17} />}</span><div><strong>{submission.problemTitle}</strong><span>{submission.language} · {new Date(submission.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div><span className={`cc-submission-status cc-submission-${submission.status}`}>{submission.status}</span></div>)}</div> : <div className="cc-empty-state"><Code2 size={23} /><p>Your submission activity will appear here.</p></div>}
        </motion.section>
      </main>
    </div>
  );
}

export default UserProfile;
