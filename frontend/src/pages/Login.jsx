import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Braces, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../authSlice';

const loginSchema = z.object({
  emailId: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  return (
    <div className="cc-auth-page">
      <NavLink to="/" className="cc-auth-brand"><span><Braces size={20} /></span>CodeCraft</NavLink>
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="cc-auth-card">
        <div className="cc-auth-heading"><h1>Welcome back</h1><p>Sign in to continue solving problems.</p></div>
        <form onSubmit={handleSubmit((data) => dispatch(loginUser(data)))} className="cc-auth-form">
          <label><span>Email</span><input type="email" autoComplete="email" placeholder="you@example.com" {...register('emailId')} />{errors.emailId && <small>{errors.emailId.message}</small>}</label>
          <label><span>Password</span><div className="cc-password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" {...register('password')} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label>
          {error && error !== 'Something went wrong' && <div className="cc-form-error" role="alert">{error}</div>}
          <button type="submit" className="cc-button cc-button-primary cc-auth-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="cc-auth-switch">New to CodeCraft? <NavLink to="/signup">Create an account</NavLink></p>
      </motion.main>
      <p className="cc-auth-note">Practice consistently. Improve deliberately.</p>
    </div>
  );
}

export default Login;
