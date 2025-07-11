import { motion } from 'framer-motion';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon = null
}) {
  const baseClasses = 'rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-secondary-500 via-primary-600 to-secondary-500 hover:from-secondary-600 hover:via-primary-700 hover:to-secondary-600 text-white border-0',
    secondary: 'bg-dark-300/90 hover:bg-dark-200/90 text-secondary-300 border border-secondary-500/40 hover:border-secondary-500/70',
    outline: 'bg-transparent hover:bg-secondary-500/20 text-secondary-300 border border-secondary-500/50 hover:border-secondary-400',
    danger: 'bg-gradient-to-r from-error-500 via-error-600 to-error-500 hover:from-error-600 hover:to-error-700 text-white border-0',
    success: 'bg-gradient-to-r from-success-500 via-success-600 to-success-500 hover:from-success-600 hover:to-success-700 text-white border-0',
    ghost: 'bg-transparent hover:bg-dark-200/60 text-gray-300 hover:text-secondary-300',
  };
  
  const sizeClasses = {
    xs: 'text-xs py-1 px-2.5 rounded-lg',
    small: 'text-sm py-1.5 px-3.5 rounded-lg',
    medium: 'py-2 px-5 rounded-xl',
    large: 'text-lg py-2.5 px-6 rounded-xl',
    xl: 'text-xl py-3 px-7 rounded-2xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-glow-purple active:shadow-glow-purple-lg';
  
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </motion.button>
  );
}

export default Button;
