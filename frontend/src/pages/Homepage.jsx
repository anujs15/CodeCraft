import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, Circle, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/ui/Navbar';

const difficultyClass = { easy: 'cc-difficulty-easy', medium: 'cc-difficulty-medium', hard: 'cc-difficulty-hard' };

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ difficulty: 'all', status: 'all' });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [problemResponse, solvedResponse] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/problemSolvedByUser'),
        ]);
        if (active) {
          setProblems(Array.isArray(problemResponse.data) ? problemResponse.data : []);
          setSolvedProblems(Array.isArray(solvedResponse.data) ? solvedResponse.data : []);
        }
      } catch (error) {
        console.error('Unable to load problems:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const solvedIds = useMemo(() => new Set(solvedProblems.map((problem) => String(problem._id))), [solvedProblems]);
  const stats = useMemo(() => {
    const count = (level) => solvedProblems.filter((problem) => problem.difficulty?.toLowerCase() === level).length;
    return { total: solvedProblems.length, easy: count('easy'), medium: count('medium'), hard: count('hard') };
  }, [solvedProblems]);

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const difficulty = problem.difficulty?.toLowerCase();
    const isSolved = solvedIds.has(String(problem._id));
    const matchesText = `${problem.title} ${problem.tags}`.toLowerCase().includes(query.toLowerCase());
    const matchesDifficulty = filters.difficulty === 'all' || difficulty === filters.difficulty;
    const matchesStatus = filters.status === 'all' || (filters.status === 'solved' ? isSolved : !isSolved);
    return matchesText && matchesDifficulty && matchesStatus;
  }), [filters, problems, query, solvedIds]);

  const completion = problems.length ? Math.round((stats.total / problems.length) * 100) : 0;

  return (
    <div className="cc-app-shell">
      <Navbar />
      <main className="cc-page">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cc-home-heading">
          <div><p className="cc-eyebrow">Problem set</p><h1>Sharpen your problem-solving skills.</h1><p>Pick a problem, write a solution, and learn from every submission.</p></div>
          <NavLink to="/profile" className="cc-button cc-button-secondary">View progress <ArrowRight size={16} /></NavLink>
        </motion.section>

        <section className="cc-dashboard-grid">
          <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="cc-panel cc-progress-card">
            <div className="cc-panel-title-row"><div><p className="cc-eyebrow">Your progress</p><h2>{user?.firstName || 'Coder'}</h2></div><Sparkles size={18} className="cc-accent-icon" /></div>
            <div className="cc-progress-ring" style={{ '--progress': `${completion * 3.6}deg` }}><div><strong>{stats.total}</strong><span>of {problems.length} solved</span></div></div>
            <div className="cc-stat-list">
              <div><span><i className="cc-dot cc-dot-easy" />Easy</span><strong>{stats.easy}</strong></div>
              <div><span><i className="cc-dot cc-dot-medium" />Medium</span><strong>{stats.medium}</strong></div>
              <div><span><i className="cc-dot cc-dot-hard" />Hard</span><strong>{stats.hard}</strong></div>
            </div>
            <NavLink to="/profile" className="cc-inline-link">Open activity dashboard <ChevronRight size={15} /></NavLink>
          </motion.aside>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="cc-panel cc-problem-panel">
            <div className="cc-problem-toolbar">
              <label className="cc-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search problems or tags" /></label>
              <div className="cc-filter-group"><SlidersHorizontal size={16} />
                <select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })} aria-label="Filter by difficulty"><option value="all">All difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
                <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} aria-label="Filter by status"><option value="all">All status</option><option value="solved">Solved</option><option value="unsolved">To do</option></select>
              </div>
            </div>

            <div className="cc-table-head"><span>Status</span><span>Title</span><span>Difficulty</span><span>Topic</span></div>
            <div className="cc-problem-list">
              {loading ? Array.from({ length: 6 }).map((_, index) => <div className="cc-problem-skeleton" key={index} />) : filteredProblems.length ? filteredProblems.map((problem, index) => {
                const difficulty = problem.difficulty?.toLowerCase() || 'medium';
                const solved = solvedIds.has(String(problem._id));
                return <motion.div key={problem._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(index * 0.025, 0.2) }}><NavLink to={`/problem/${problem._id}`} className="cc-problem-row"><span className={solved ? 'cc-status-solved' : 'cc-status-open'}>{solved ? <Check size={16} /> : <Circle size={14} />}</span><span className="cc-problem-title">{index + 1}. {problem.title}</span><span className={`cc-difficulty ${difficultyClass[difficulty]}`}>{difficulty}</span><span className="cc-topic">{problem.tags}</span></NavLink></motion.div>;
              }) : <div className="cc-empty-state"><Search size={22} /><p>No problems match these filters.</p><button onClick={() => { setQuery(''); setFilters({ difficulty: 'all', status: 'all' }); }}>Clear filters</button></div>}
            </div>
            <div className="cc-list-footer">Showing {filteredProblems.length} of {problems.length} problems</div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;
