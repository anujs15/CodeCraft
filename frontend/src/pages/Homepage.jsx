import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { motion } from 'framer-motion';
import { CheckCircle, LogOut, User, Settings, Code, Filter, ArrowRight, Star, BarChart3, LineChart, Activity, Heart, Github } from 'lucide-react';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(true);
  // Add stats state
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
        
        // Calculate stats
        const totalSolved = data.length;
        const easySolved = data.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
        const mediumSolved = data.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
        const hardSolved = data.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
        
        setStats({
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          completionRate: problems.length > 0 ? Math.round((totalSolved / problems.length) * 100) : 0
        });
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user, problems.length]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty.toLowerCase() === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags.toLowerCase() === filters.tag;
    const isSolved = solvedProblems.some(sp => String(sp._id) === String(problem._id));
    const statusMatch =
      filters.status === 'all' ||
      (filters.status === 'solved' && isSolved) ||
      (filters.status === 'unsolved' && !isSolved);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-16 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple-600/20 to-transparent opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-600/20 to-transparent opacity-20 blur-3xl rounded-full"></div>
      </div>
      
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="navbar max-w-7xl mx-auto mt-4 rounded-xl sticky top-3 z-50 bg-gray-900/70 backdrop-blur-xl shadow-lg border border-purple-500/10 px-6 py-3"
      >
        <div className="flex-1">
          <NavLink to="/" className="flex items-center group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="mr-2 p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full"
            >
              <Code size={20} className="text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-purple-700 transition-all duration-300">
              CodeCraft
            </span>
          </NavLink>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar shadow-md group">
              <div className="w-10 rounded-full ring-2 ring-purple-500/50 group-hover:ring-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-500 to-blue-600">
                <User className="w-full h-full p-2 text-white" />
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow-lg rounded-box bg-gray-900/90 backdrop-blur-xl border border-purple-500/20 w-52 animate-in slide-in-from-top-5 duration-200">
              <li className="menu-title text-purple-400 font-bold">
                <span>{user?.firstName || 'User'}</span>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="text-gray-200 hover:bg-purple-500/20 group flex items-center gap-2">
                    <Settings size={16} className="text-purple-400 group-hover:rotate-90 transition-transform duration-300" /> 
                    <span>Admin Panel</span>
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-red-400 hover:bg-red-500/20 group flex items-center gap-2">
                  <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-300" /> 
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </motion.nav>

      {/* Hero content */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="relative max-w-7xl mx-auto px-6 py-16 text-center"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
        >
          Master <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">Coding Challenges</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Practice problem-solving and advance your programming skills with our collection of coding challenges.
        </motion.p>
      </motion.div>

      {/* Statistics Section - New Addition */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto px-6 mb-12"
        >
          <div className="bg-gray-800/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-purple-300 mb-6 flex items-center">
              <Activity className="mr-2" /> Your Progress Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/80 p-4 rounded-lg border border-purple-500/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-400 text-sm">Total Solved</h3>
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <CheckCircle size={16} className="text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalSolved}</p>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats.completionRate}% completed</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/80 p-4 rounded-lg border border-green-500/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-400 text-sm">Easy</h3>
                  <div className="p-2 rounded-full bg-green-500/20">
                    <BarChart3 size={16} className="text-green-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-400">{stats.easySolved}</p>
                <p className="text-xs text-gray-400 mt-1">problems solved</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/80 p-4 rounded-lg border border-yellow-500/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-400 text-sm">Medium</h3>
                  <div className="p-2 rounded-full bg-yellow-500/20">
                    <BarChart3 size={16} className="text-yellow-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2 text-yellow-400">{stats.mediumSolved}</p>
                <p className="text-xs text-gray-400 mt-1">problems solved</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/80 p-4 rounded-lg border border-red-500/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-400 text-sm">Hard</h3>
                  <div className="p-2 rounded-full bg-red-500/20">
                    <BarChart3 size={16} className="text-red-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2 text-red-400">{stats.hardSolved}</p>
                <p className="text-xs text-gray-400 mt-1">problems solved</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto mt-2 mb-10 px-6 py-5 rounded-xl bg-gray-800/40 backdrop-blur-md border border-purple-500/20 shadow-xl"
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-lg font-semibold text-purple-300 flex items-center">
            <Filter size={18} className="mr-2" /> Filters:
          </span>
          <select 
            className="select select-sm bg-gray-900 text-white border-purple-500/30 hover:border-purple-500 focus:border-purple-500 rounded-lg" 
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select 
            className="select select-sm bg-gray-900 text-white border-purple-500/30 hover:border-purple-500 focus:border-purple-500 rounded-lg" 
            value={filters.difficulty} 
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select 
            className="select select-sm bg-gray-900 text-white border-purple-500/30 hover:border-purple-500 focus:border-purple-500 rounded-lg" 
            value={filters.tag} 
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>
      </motion.div>

      {/* Problem List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg text-purple-500"></div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 max-w-5xl mx-auto mb-20 px-6"
        >
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => {
              const isSolved = solvedProblems.some(sp => String(sp._id) === String(problem._id));
              return (
                <motion.div
                  key={problem._id}
                  variants={item}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 10px 30px -15px rgba(130, 80, 223, 0.3)",
                    transition: { duration: 0.2 } 
                  }}
                  className={`rounded-xl border ${isSolved ? 'border-green-500/40' : 'border-purple-500/20'} bg-gray-900/80 backdrop-blur-sm hover:backdrop-blur-md transition duration-300 overflow-hidden`}
                >
                  <NavLink to={`/problem/${problem._id}`} className="block p-5 relative">
                    {/* Glow effect */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${getDifficultyAccentColor(problem.difficulty)}`}></div>
                    
                    <div className="flex justify-between items-center pl-3">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <span className={`mr-3 h-8 w-8 rounded-full bg-gradient-to-br ${getDifficultyGradient(problem.difficulty)} flex items-center justify-center text-white`}>
                          <Star size={14} className="opacity-80" />
                        </span>
                        {problem.title}
                      </h2>
                      {isSolved && (
                        <div className="badge bg-green-600/20 border-green-500 text-green-400 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={14} className="text-green-500" /> Solved
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 ml-11">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center ${getDifficultyBadgeColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-purple-400/10 border border-purple-400/30 text-purple-300 capitalize shadow-sm">
                        {problem.tags}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs text-purple-300/70 flex items-center group">
                        Solve Challenge 
                        <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </NavLink>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center text-gray-400 col-span-full mt-12 p-12 border border-dashed border-gray-700 rounded-xl"
            >
              <p className="text-xl">No problems match the selected filters</p>
              <button 
                onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
                className="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-green-600/20 border border-green-500/50 text-green-400';
    case 'medium': return 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-400';
    case 'hard': return 'bg-red-600/20 border border-red-500/50 text-red-400';
    default: return 'bg-gray-500/20 border border-gray-500/50 text-gray-400';
  }
};

const getDifficultyAccentColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-gradient-to-b from-green-500 to-green-700';
    case 'medium': return 'bg-gradient-to-b from-yellow-500 to-yellow-600';
    case 'hard': return 'bg-gradient-to-b from-red-500 to-red-700';
    default: return 'bg-gradient-to-b from-gray-500 to-gray-700';
  }
};

const getDifficultyGradient = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'from-green-500 to-green-600';
    case 'medium': return 'from-yellow-500 to-yellow-600';
    case 'hard': return 'from-red-500 to-red-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

export default Homepage;
