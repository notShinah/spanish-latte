'use client';

import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='bg-card/90 border-t border-border mt-16'
    >
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <motion.div
            className='flex items-center gap-3 group'
            whileHover={{ scale: 1.05 }}
          >
            <div className='relative'>
              <div className='w-8 h-8 bg-accent rounded-full flex items-center justify-center'>
                <Heart className='h-4 w-4 text-white animate-ping' />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-rose-400 to-red-400 rounded-full'
              />
            </div>
            <span className='text-sm font-medium text-foreground'>
              Mini Moments - Made with love
            </span>
          </motion.div>

          <div className='flex items-center gap-2'>
            <p className='text-sm text-muted-foreground font-medium'>
              © 2024 Mini Moments. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}