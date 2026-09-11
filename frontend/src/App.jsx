import {Routes, Route ,Navigate, useLocation} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import { motion, AnimatePresence } from 'framer-motion';
import AdminUpdate from "./components/AdminUpdate";
import AdminUpdateProblem from "./components/AdminUpdateProblem";
import AdminRegister from "./components/AdminRegister";
import UserProfile from "./pages/UserProfile";

function App(){
  const location = useLocation();
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="cc-loading-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="cc-loading-card"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="cc-loading-mark"
          >
            <span>{'{ }'}</span>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="cc-loading-title"
          >
            CodeCraft
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="cc-loading-copy"
          >
            Preparing your workspace…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return(
    <div className="cc-app-root">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <Routes>
            <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
            <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
            <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
            <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
            <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
            <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
             <Route path="/admin/update/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdateProblem /> : <Navigate to="/" />} />
            <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
            <Route path="/admin/register" element={isAuthenticated && user?.role === 'admin' ? <AdminRegister /> : <Navigate to="/" />} />
            <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
            <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App;
