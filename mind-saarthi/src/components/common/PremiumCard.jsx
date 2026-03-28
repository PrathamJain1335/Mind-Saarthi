import React from 'react';
import { motion } from 'framer-motion';

const PremiumCard = ({ children, className = '', delay = 0, noHover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={noHover ? {} : { 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(23 93 197 / 0.1), 0 8px 10px -6px rgb(23 93 197 / 0.1)"
      }}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PremiumCard;
