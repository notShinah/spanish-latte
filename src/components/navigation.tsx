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
      className='sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border'
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-3 group'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='relative'
          >
            <div className='w-10 h-10 bg-accent rounded-full flex items-center justify-center'>
              <Heart className='h-5 w-5 text-white animate-ping' />
            </div>
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping'></div>
          </motion.div>
          <div className='flex flex-col'>
            <span className='text-xl font-bold text-foreground'>Mini Moments</span>
            <div className='h-0.5 bg-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
          </div>
        </Link>

        <div className='flex items-center gap-6'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/'
              className='relative text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 group'
            >
              Home
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-200'></span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/dashboard'
              className='relative text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 group'
            >
              Dashboard
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-200'></span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href='/login'
              className='relative text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 group'
            >
              Admin
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-200'></span>
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
              className='h-10 w-10 rounded-full bg-background border border-border shadow transition-colors duration-200 hover:bg-card'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </motion.div>
        </div>
      </div>

    </motion.nav>
  );
}