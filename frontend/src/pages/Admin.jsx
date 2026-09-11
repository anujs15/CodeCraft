import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Edit3, Plus, ShieldCheck, Trash2, Video, Wrench } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/ui/Navbar';

const managementActions = [
  { title: 'Create a problem', description: 'Add the statement, test cases, starter code, and reference solutions.', icon: Plus, route: '/admin/create', tone: 'green' },
  { title: 'Edit problem library', description: 'Review and update existing challenge content and test coverage.', icon: Edit3, route: '/admin/update', tone: 'blue' },
  { title: 'Manage video editorials', description: 'Upload or remove the walkthrough attached to each problem.', icon: Video, route: '/admin/video', tone: 'amber' },
];

function Admin() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        if (active) setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Unable to load admin overview:', error);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProblems();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => ({
    total: problems.length,
    easy: problems.filter((problem) => problem.difficulty?.toLowerCase() === 'easy').length,
    medium: problems.filter((problem) => problem.difficulty?.toLowerCase() === 'medium').length,
    hard: problems.filter((problem) => problem.difficulty?.toLowerCase() === 'hard').length,
  }), [problems]);

  const stats = [
    { label: 'Total problems', value: counts.total, className: 'total' },
    { label: 'Easy', value: counts.easy, className: 'easy' },
    { label: 'Medium', value: counts.medium, className: 'medium' },
    { label: 'Hard', value: counts.hard, className: 'hard' },
  ];

  return (
    <div className="cc-app-shell">
      <Navbar />
      <main className="cc-page cc-admin-page">
        <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="cc-admin-heading">
          <div><p className="cc-eyebrow">Administration</p><h1>Workspace overview</h1><p>Manage the problem library, editorials, and platform access.</p></div>
          <NavLink to="/" className="cc-button cc-button-secondary"><BookOpen size={16} /> View problem set</NavLink>
        </motion.header>

        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 }} className="cc-admin-stats" aria-label="Problem statistics">
          {stats.map((stat) => <div className={`cc-admin-stat cc-admin-stat-${stat.className}`} key={stat.label}><span>{stat.label}</span>{loading ? <i className="cc-admin-stat-loading" /> : <strong>{loadError ? '—' : stat.value}</strong>}</div>)}
        </motion.section>

        <section className="cc-admin-layout">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="cc-panel cc-admin-management">
            <div className="cc-admin-section-heading"><div className="cc-admin-section-icon"><Wrench size={18} /></div><div><h2>Content management</h2><p>Create and maintain the learning experience.</p></div></div>
            <div className="cc-admin-action-list">
              {managementActions.map((action) => {
                const Icon = action.icon;
                return <NavLink to={action.route} className="cc-admin-action" key={action.title}><span className={`cc-admin-action-icon cc-admin-action-${action.tone}`}><Icon size={19} /></span><span><strong>{action.title}</strong><small>{action.description}</small></span><ArrowRight size={17} /></NavLink>;
              })}
            </div>
          </motion.div>

          <div className="cc-admin-side">
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .11 }} className="cc-panel cc-admin-side-card">
              <span className="cc-admin-side-icon"><ShieldCheck size={20} /></span>
              <div><p className="cc-eyebrow">Access control</p><h2>Add an administrator</h2><p>Create a separate admin account without changing your current session.</p></div>
              <NavLink to="/admin/register" className="cc-button cc-button-secondary">Manage access <ArrowRight size={15} /></NavLink>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14 }} className="cc-panel cc-admin-danger">
              <div><Trash2 size={18} /><span><strong>Delete problems</strong><small>Permanently remove a challenge from the library.</small></span></div>
              <NavLink to="/admin/delete">Open delete tools <ArrowRight size={14} /></NavLink>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
