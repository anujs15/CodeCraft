import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';

const AdminVideo = () => {
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
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
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
          <span>{error.response.data.error}</span>
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Video Management</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect rounded-lg shadow-xl border border-purple-500/20"
        >
          <div className="overflow-x-auto">
            <table className="table w-full table-sm sm:table-md">
              <thead>
                <tr>
                  <th className="w-[5%] sm:w-[10%]">#</th>
                  <th className="w-[35%] sm:w-[40%]">Title</th>
                  <th className="w-[20%] sm:w-[15%]">Difficulty</th>
                  <th className="w-[20%] hidden sm:table-cell">Tags</th>
                  <th className="w-[20%] sm:w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <motion.tr 
                    key={problem._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-purple-500/10 transition-colors duration-200"
                  >
                    <th>{index + 1}</th>
                    <td className="text-xs sm:text-sm">{problem.title}</td>
                    <td>
                      <span className={`badge badge-xs sm:badge-sm ${
                        problem.difficulty === 'Easy' 
                          ? 'badge-success' 
                          : problem.difficulty === 'Medium' 
                            ? 'badge-warning' 
                            : 'badge-error'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="badge badge-xs sm:badge-sm badge-outline">
                        {problem.tags}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-1">
                         <NavLink 
                            to={`/admin/upload/${problem._id}`}
                            className="btn btn-xs sm:btn-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:scale-105 transition-transform"
                            >
                            Upload
                        </NavLink>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <motion.button 
                          onClick={() => handleDelete(problem._id)}
                          className="btn btn-sm bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:scale-105 transition-transform"
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

export default AdminVideo;