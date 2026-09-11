import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Braces, ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { logoutUser } from '../../authSlice';

const navClass = ({ isActive }) => `cc-nav-link ${isActive ? 'cc-nav-link-active' : ''}`;

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="cc-header">
      <div className="cc-header-inner">
        <NavLink to="/" className="cc-brand" aria-label="CodeCraft home">
          <span className="cc-brand-mark"><Braces size={19} /></span>
          <span>CodeCraft</span>
        </NavLink>

        {user && (
          <nav className="cc-main-nav" aria-label="Primary navigation">
            <NavLink to="/" end className={navClass}>Problems</NavLink>
            <NavLink to="/profile" className={navClass}>Progress</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          </nav>
        )}

        <div className="cc-header-actions">
          {user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="cc-user-trigger" aria-label="Open account menu">
                <span className="cc-avatar">{user.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                <span className="cc-user-name">{user.firstName || 'User'}</span>
                <ChevronDown size={14} />
              </button>
              <ul tabIndex={0} className="dropdown-content cc-account-menu">
                <li className="cc-account-heading"><span className="cc-account-email">{user.emailId}</span><span>{user.role === 'admin' ? 'Administrator' : 'Member'}</span></li>
                <li><NavLink to="/profile"><UserRound size={16} /> My progress</NavLink></li>
                {user.role === 'admin' && <li><NavLink to="/admin"><Settings size={16} /> Admin panel</NavLink></li>}
                <li className="cc-menu-separator"><button onClick={() => dispatch(logoutUser())}><LogOut size={16} /> Sign out</button></li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="cc-button cc-button-ghost">Sign in</NavLink>
              <NavLink to="/signup" className="cc-button cc-button-primary">Create account</NavLink>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
