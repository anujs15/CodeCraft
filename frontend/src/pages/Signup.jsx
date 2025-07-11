import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 to-gray-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-purple-500/20 p-6 z-10"
      >
        <div className="card-body">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            CodeCraft
          </motion.h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-gray-300 mb-1 block">First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register('firstName')}
                className={`w-full px-4 py-2 bg-gray-800/50 text-white placeholder-gray-400 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition`}
              />
              {errors.firstName && (
                <span className="text-red-400 text-xs mt-1 block">{errors.firstName.message}</span>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-gray-300 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('emailId')}
                className={`w-full px-4 py-2 bg-gray-800/50 text-white placeholder-gray-400 border ${
                  errors.emailId ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition`}
              />
              {errors.emailId && (
                <span className="text-red-400 text-xs mt-1 block">{errors.emailId.message}</span>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              className="mb-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-gray-300 mb-1 block">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-2 pr-10 bg-gray-800/50 text-white placeholder-gray-400 border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition`}
              />
              <button
                type="button"
                className="absolute top-8 right-3 text-gray-400 hover:text-purple-400 transition"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-colors text-white font-semibold shadow-md ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </motion.div>
          </form>

          {/* Redirect to login */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm text-gray-400">
              Already have an account?{' '}
              <NavLink
                to="/login"
                className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
              >
                Login
              </NavLink>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
