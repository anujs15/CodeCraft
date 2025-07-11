import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Code, User, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '../../authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="navbar max-w-7xl mx-auto mt-4 rounded-2xl sticky top-3 z-50 bg-dark-300/90 backdrop-blur-xl border border-secondary-500/20 shadow-glow-purple px-6 py-3"
    >
      <div className="flex-1">
        <NavLink to="/" className="flex items-center group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="mr-2 p-2 bg-gradient-to-br from-secondary-500 via-primary-600 to-secondary-600 rounded-xl shadow-glow-purple"
          >
            <Code size={20} className="text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 via-primary-400 to-secondary-500 animate-pulse-slow">
            CodeCraft
          </span>
        </NavLink>
      </div>
      {user ? (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar shadow-glow-purple">
              <div className="w-10 rounded-xl ring-2 ring-secondary-500/50 hover:ring-secondary-400 transition-all duration-300 bg-gradient-to-br from-secondary-400 to-primary-500">
                <User className="w-full h-full p-2 text-white" />
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow-glow-purple bg-dark-300/95 backdrop-blur-xl border border-secondary-500/30 rounded-xl w-52">
              <li className="menu-title text-secondary-400 font-bold">
                <span>{user?.firstName || 'User'}</span>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="text-gray-200 hover:bg-secondary-500/20">
                    <Settings size={16} className="text-secondary-400" /> 
                    <span>Admin Panel</span>
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-error-500 hover:bg-error-500/20">
                  <LogOut size={16} /> 
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <NavLink to="/login" className="btn btn-sm bg-dark-300/90 hover:bg-dark-200 text-secondary-300 border border-secondary-500/40 hover:border-secondary-400 rounded-xl shadow-glow-purple transition-all duration-300">
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-sm bg-gradient-to-r from-secondary-500 via-primary-600 to-secondary-500 hover:from-secondary-600 hover:to-primary-700 text-white border-none rounded-xl shadow-glow-purple transition-all duration-300">
            Sign Up
          </NavLink>
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
