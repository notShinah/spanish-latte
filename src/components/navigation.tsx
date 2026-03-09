'use client';

import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='sticky top-0 z-50 glass-effect shadow-3d'
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-3 group'>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className='relative'
          >
            <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50'>
              <Heart className='h-5 w-5 text-white' />
            </div>
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-rose-400 to-red-400 rounded-full animate-pulse-glow'></div>
          </motion.div>
          <div className='flex flex-col'>
            <span className='text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300'>
              Mini Moments
            </span>
            <div className='h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
          </div>
        </Link>

        <div className='flex items-center gap-6'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/'
              className='relative text-sm font-medium text-pink-700 hover:text-pink-600 transition-all duration-300 group'
            >
              Home
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300'></span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/dashboard'
              className='relative text-sm font-medium text-pink-700 hover:text-pink-600 transition-all duration-300 group'
            >
              Dashboard
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300'></span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/login'
              className='relative text-sm font-medium text-pink-700 hover:text-pink-600 transition-all duration-300 group'
            >
              Admin
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300'></span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className='h-10 w-10 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 border border-pink-200 shadow-lg hover:shadow-pink-200/50 transition-all duration-300'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-pink-600' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-pink-600' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className='absolute top-2 left-1/4 pointer-events-none'>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60'
        />
      </div>

      <div className='absolute top-4 right-1/3 pointer-events-none'>
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className='w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-red-400 rounded-full opacity-50'
        />
      </div>
    </motion.nav>
  );
}