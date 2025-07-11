import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <span className="loading loading-spinner loading-lg text-purple-400"></span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="alert alert-error shadow-lg my-4 bg-red-500/20 border border-red-500/50"
      >
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Submission History</h2>
      
      {submissions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="alert alert-info shadow-lg bg-blue-500/20 border border-blue-500/50"
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No submissions found for this problem</span>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect rounded-lg shadow-xl border border-purple-500/20 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="table w-full table-sm sm:table-md">
                <thead>
                  <tr className="bg-purple-500/10">
                    <th className="px-1 sm:px-4">#</th>
                    <th className="px-1 sm:px-4">Lang</th>
                    <th className="px-1 sm:px-4">Status</th>
                    <th className="px-1 sm:px-4 hidden sm:table-cell">Runtime</th>
                    <th className="px-1 sm:px-4 hidden sm:table-cell">Memory</th>
                    <th className="px-1 sm:px-4">Tests</th>
                    <th className="px-1 sm:px-4 hidden sm:table-cell">Submitted</th>
                    <th className="px-1 sm:px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, index) => (
                    <motion.tr 
                      key={sub._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-purple-500/10 transition-colors duration-200"
                    >
                      <td className="px-1 sm:px-4">{index + 1}</td>
                      <td className="px-1 sm:px-4 font-mono text-xs sm:text-sm">{sub.language}</td>
                      <td className="px-1 sm:px-4">
                        <span className={`badge badge-xs sm:badge-sm ${getStatusColor(sub.status)}`}>
                          {sub.status === 'accepted' ? 'OK' : sub.status.charAt(0).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-1 sm:px-4 font-mono text-xs hidden sm:table-cell">{sub.runtime}sec</td>
                      <td className="px-1 sm:px-4 font-mono text-xs hidden sm:table-cell">{formatMemory(sub.memory)}</td>
                      <td className="px-1 sm:px-4 font-mono text-xs sm:text-sm">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                      <td className="px-1 sm:px-4 text-xs hidden sm:table-cell">{formatDate(sub.createdAt)}</td>
                      <td className="px-1 sm:px-4">
                        <motion.button 
                          className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                          onClick={() => setSelectedSubmission(sub)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Code
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <p className="mt-4 text-sm text-gray-400 text-center">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal modal-open"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="modal-box w-11/12 max-w-5xl glass-effect border border-purple-500/20 p-3 sm:p-6"
          >
            <h3 className="font-bold text-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Submission Details: {selectedSubmission.language}
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="badge badge-outline">
                  Runtime: {selectedSubmission.runtime}s
                </span>
                <span className="badge badge-outline">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge badge-outline">
                  Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                </span>
              </div>
              
              {selectedSubmission.errorMessage && (
                <div className="alert alert-error mt-2 bg-red-500/20 border border-red-500/50">
                  <div>
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
            
            <pre className="p-4 bg-gray-900/50 text-gray-100 rounded-lg overflow-x-auto border border-gray-700">
              <code>{selectedSubmission.code}</code>
            </pre>
            
            <div className="modal-action">
              <motion.button 
                className="btn btn-outline"
                onClick={() => setSelectedSubmission(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubmissionHistory;