import { motion } from 'framer-motion';

function Card({ 
  children, 
  className = '', 
  hoverable = true,
  gradient = false,
  bordered = true,
  glassEffect = true
}) {
  const baseClasses = 'rounded-2xl overflow-hidden transition-all duration-300';
  
  const hoverClasses = hoverable ? 'hover:shadow-glow-purple hover:-translate-y-1' : '';
  
  const bgClasses = gradient 
    ? 'bg-gradient-to-br from-dark-200 via-dark-300 to-dark-200'
    : glassEffect 
      ? 'bg-dark-300/80 backdrop-blur-xl border border-secondary-500/30'
      : 'bg-dark-300';
      
  const borderClasses = bordered && !glassEffect ? 'border border-secondary-500/30 hover:border-secondary-500/50' : '';
  
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${hoverClasses} ${bgClasses} ${borderClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
