import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem',
      icon: Plus,
      color: 'from-green-400 to-emerald-600',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'from-blue-400 to-indigo-600',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'from-red-400 to-rose-600',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload and delete video solutions',
      icon: Video,
      color: 'from-purple-400 to-violet-600',
      route: '/admin/video'
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/20 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-center opacity-30"></div>
      </div>

      {/* Back to Home Link */}
      <div className="container mx-auto pt-6 px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink to="/" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform duration-200" /> 
            Back to Home
          </NavLink>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Admin Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Manage your coding platform with powerful tools and full control
          </p>
        </motion.div>

        {/* Admin Options Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {adminOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <motion.div
                key={option.id}
                variants={item}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(120, 80, 220, 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
                className="h-full"
              >
                <NavLink to={option.route} className="block h-full">
                  <div className="h-full rounded-2xl backdrop-blur-sm bg-gray-900/80 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 p-6 relative overflow-hidden group">
                    {/* Background gradient */}
                    <div className={`absolute -right-24 -bottom-24 w-48 h-48 rounded-full bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                    
                    <div className="flex flex-col items-center text-center h-full relative z-10">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${option.color} shadow-lg mb-5 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                        {option.title}
                      </h2>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mt-2">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default Admin;
