'use client';

import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='glass-effect shadow-3d mt-16'
    >
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <motion.div
            className='flex items-center gap-3 group'
            whileHover={{ scale: 1.05 }}
          >
            <div className='relative'>
              <div className='w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50'>
                <Heart className='h-4 w-4 text-white' />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-rose-400 to-red-400 rounded-full'
              />
            </div>
            <span className='text-sm font-medium bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300'>
              Mini Moments - Made with love 💕
            </span>
          </motion.div>

          <div className='flex items-center gap-2'>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className='h-4 w-4 text-pink-500' />
            </motion.div>
            <p className='text-sm text-pink-600 font-medium'>
              © 2024 Mini Moments. All rights reserved.
            </p>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className='h-4 w-4 text-rose-500' />
            </motion.div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className='absolute bottom-4 left-1/4 pointer-events-none'>
          <motion.div
            animate={{
              y: [0, -6, 0],
              x: [0, 3, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className='w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-40'
          />
        </div>

        <div className='absolute bottom-6 right-1/3 pointer-events-none'>
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
            className='w-2 h-2 bg-gradient-to-r from-rose-300 to-red-300 rounded-full opacity-50'
          />
        </div>
      </div>
    </motion.footer>
  );
}