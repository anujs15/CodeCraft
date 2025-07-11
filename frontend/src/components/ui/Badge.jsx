import { motion } from 'framer-motion';

function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  animated = false,
  icon = null
}) {
  const variantClasses = {
    default: 'bg-purple-400/10 border border-purple-400/30 text-purple-300',
    success: 'bg-green-600/20 border border-green-500/30 text-green-400',
    warning: 'bg-yellow-600/20 border border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-600/20 border border-red-500/30 text-red-400',
    info: 'bg-blue-600/20 border border-blue-500/30 text-blue-400',
    primary: 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300',
  };
  
  const badgeContent = (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm inline-flex items-center gap-1 ${variantClasses[variant]} ${className}`}>
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </span>
  );
  
  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className="inline-block"
      >
        {badgeContent}
      </motion.div>
    );
  }
  
  return badgeContent;
}

export default Badge;
