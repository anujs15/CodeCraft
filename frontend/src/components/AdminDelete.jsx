import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex justify-center items-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <span className="loading loading-spinner loading-lg text-orange-400"></span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"> Delete Problems</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect rounded-xl shadow-xl border border-purple-400/20"
        >
          <div className="overflow-x-auto">
            <table className="table w-full table-sm sm:table-md">
              <thead>
                <tr className="text-purple-300">
                  <th className="w-[5%] sm:w-[10%]">#</th>
                  <th className="w-[40%] sm:w-[40%]">Title</th>
                  <th className="w-[20%] sm:w-[15%]">Difficulty</th>
                  <th className="w-[15%] hidden sm:table-cell">Tags</th>
                  <th className="w-[20%] sm:w-[20%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <motion.tr
                    key={problem._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-purple-400/10 transition-colors duration-200"
                  >
                    <th>{index + 1}</th>
                    <td className="text-xs sm:text-sm font-medium text-purple-100">{problem.title}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-black ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-400'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-400'
                          : 'bg-red-500'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="px-2 py-1 rounded bg-gray-700 text-purple-300 text-xs font-mono border border-purple-500/40">
                        {problem.tags}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleDelete(problem._id)}
                          className="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-transform"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDelete;
