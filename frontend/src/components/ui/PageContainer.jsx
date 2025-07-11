import { motion } from 'framer-motion';
import Navbar from './Navbar';

function PageContainer({ children, className = '', withBackground = true }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-16 ${className}`}>
      <div className="relative overflow-hidden">
        {withBackground && (
          <>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-noise-pattern opacity-[0.03]"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple-600/20 to-transparent opacity-20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-600/20 to-transparent opacity-20 blur-3xl rounded-full"></div>
          </>
        )}
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default PageContainer;
