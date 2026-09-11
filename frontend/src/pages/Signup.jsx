import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Braces, Check, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, 'Use at least 3 characters'),
  emailId: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters').regex(/[a-z]/, 'Include a lowercase letter').regex(/[A-Z]/, 'Include an uppercase letter').regex(/[0-9]/, 'Include a number').regex(/[^A-Za-z0-9]/, 'Include a symbol'),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });
  const password = watch('password', '');

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  const rules = [{ label: '8+ characters', valid: password.length >= 8 }, { label: 'Upper & lower case', valid: /[a-z]/.test(password) && /[A-Z]/.test(password) }, { label: 'Number', valid: /[0-9]/.test(password) }, { label: 'Symbol', valid: /[^A-Za-z0-9]/.test(password) }];

  return (
    <div className="cc-auth-page">
      <NavLink to="/" className="cc-auth-brand"><span><Braces size={20} /></span>CodeCraft</NavLink>
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="cc-auth-card cc-auth-card-wide">
        <div className="cc-auth-heading"><h1>Create your account</h1><p>Start tracking your progress from the first submission.</p></div>
        <form onSubmit={handleSubmit((data) => dispatch(registerUser(data)))} className="cc-auth-form">
          <label><span>Name</span><input type="text" autoComplete="given-name" placeholder="Your first name" {...register('firstName')} />{errors.firstName && <small>{errors.firstName.message}</small>}</label>
          <label><span>Email</span><input type="email" autoComplete="email" placeholder="you@example.com" {...register('emailId')} />{errors.emailId && <small>{errors.emailId.message}</small>}</label>
          <label><span>Password</span><div className="cc-password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password" {...register('password')} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label>
          <div className="cc-password-rules">{rules.map((rule) => <span className={rule.valid ? 'is-valid' : ''} key={rule.label}><Check size={12} />{rule.label}</span>)}</div>
          {error && error !== 'Something went wrong' && <div className="cc-form-error" role="alert">{error}</div>}
          <button type="submit" className="cc-button cc-button-primary cc-auth-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="cc-auth-switch">Already have an account? <NavLink to="/login">Sign in</NavLink></p>
      </motion.main>
      <p className="cc-auth-note">Free to practice. Built for steady progress.</p>
    </div>
  );
}

export default Signup;
