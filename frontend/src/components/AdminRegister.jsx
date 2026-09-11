import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import axiosClient from '../utils/axiosClient';


const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number')
  .regex(/[^A-Za-z0-9]/, 'Include a symbol');

const adminSchema = z.object({
  firstName: z.string().min(3, 'Minimum 3 characters'),
  emailId: z.string().email('Invalid email'),
  password: strongPassword,
});

function AdminRegister() {
  const [serverError, setServerError] = useState(null);
  const [createdAdmin, setCreatedAdmin] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(adminSchema) });

  const onSubmit = async (data) => {
    setServerError(null);
    setCreatedAdmin(null);
    try {
      const res = await axiosClient.post('/user/admin/register', data);
      setCreatedAdmin(res.data.user);
      reset();
    } catch (err) {
      // Backend sends plain-text errors like "Error: ...", e.g. duplicate email.
      const message =
        err.response?.data?.message || err.response?.data || err.message;
      setServerError(typeof message === 'string' ? message : 'Failed to create admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4">
      <div className="container mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink to="/admin" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Admin Dashboard
          </NavLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto pb-16"
      >
        <div className="glass-effect p-6 rounded-xl shadow-2xl border border-purple-500/30">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg mb-3">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              Make Admin
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Create a new admin account. They can sign in with these credentials
              and will have full admin access.
            </p>
          </div>

          {createdAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/40 text-green-300 text-sm"
            >
              <span className="font-semibold">{createdAdmin.emailId}</span> is now an admin.
            </motion.div>
          )}

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm break-words"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-300 mb-1 block text-sm">First Name</label>
              <input
                type="text"
                placeholder="Jane"
                {...register('firstName')}
                className="w-full px-4 py-2 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
              {errors.firstName && (
                <span className="text-red-400 text-xs mt-1 block">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <label className="text-gray-300 mb-1 block text-sm">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                {...register('emailId')}
                className="w-full px-4 py-2 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
              {errors.emailId && (
                <span className="text-red-400 text-xs mt-1 block">{errors.emailId.message}</span>
              )}
            </div>

            <div>
              <label className="text-gray-300 mb-1 block text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full px-4 py-2 bg-gray-800/60 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Min 8 chars with upper &amp; lower case, a number and a symbol.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-lg font-bold py-2 rounded-xl shadow-xl ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating…' : 'Create Admin'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminRegister;
