'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, ShoppingCart, TrendingUp, Heart, Gamepad2, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,204',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: '$12,430',
      change: '+8%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Games Played',
      value: '3,247',
      change: '+23%',
      icon: Gamepad2,
      trend: 'up'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '-2%',
      icon: Heart,
      trend: 'down'
    }
  ];

  const recentActivity = [
    { user: 'Alice', action: 'Completed Find the Cats', time: '2 minutes ago' },
    { user: 'Bob', action: 'Created new artwork', time: '5 minutes ago' },
    { user: 'Charlie', action: 'Won Catch My Heart', time: '10 minutes ago' },
    { user: 'Diana', action: 'Shared photobooth photo', time: '15 minutes ago' }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='mb-8 text-center'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='inline-flex items-center gap-3 mb-4'
            >
              <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50'>
                <Heart className='h-6 w-6 text-white' />
              </div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent'>
                Dashboard
              </h1>
              <div className='w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50'>
                <Sparkles className='h-6 w-6 text-white' />
              </div>
            </motion.div>
            <p className='text-lg text-pink-700 font-medium'>
              Welcome back! Here's what's happening with Mini Moments 💕
            </p>
          </div>

          {/* Stats Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                className='perspective-1000'
              >
                <Card className='shadow-3d hover:shadow-3d-hover transition-all duration-500 border-2 border-pink-200 hover:border-pink-300 bg-gradient-to-br from-white to-pink-50/30 group cursor-pointer'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-bold text-pink-800 group-hover:text-pink-700 transition-colors'>
                      {stat.title}
                    </CardTitle>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className='w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50'
                    >
                      <stat.icon className='h-5 w-5 text-white' />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2'>
                      {stat.value}
                    </div>
                    <div className='flex items-center gap-1 mt-1'>
                      <Badge
                        variant={stat.trend === 'up' ? 'default' : 'secondary'}
                        className={`text-xs font-semibold ${
                          stat.trend === 'up'
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                        }`}
                      >
                        <TrendingUp className='h-3 w-3 mr-1' />
                        {stat.change}
                      </Badge>
                      <span className='text-xs text-pink-600 font-medium'>from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className='perspective-1000'
          >
            <Card className='shadow-3d hover:shadow-3d-hover transition-all duration-500 border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30'>
              <CardHeader className='bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg'>
                <CardTitle className='flex items-center gap-2 text-pink-800'>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className='w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg'
                  >
                    <Heart className='h-4 w-4 text-white' />
                  </motion.div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20, rotateY: -10 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        rotateY: 2,
                        z: 20
                      }}
                      className='flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 hover:border-pink-300 shadow-lg hover:shadow-pink-100/50 transition-all duration-300 cursor-pointer group'
                    >
                      <div className='flex items-center gap-3'>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className='w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-pink-200/50'
                        >
                          <span className='text-white font-bold text-sm'>
                            {activity.user.charAt(0)}
                          </span>
                        </motion.div>
                        <div>
                          <p className='font-semibold text-pink-800 group-hover:text-pink-700 transition-colors'>
                            {activity.user}
                          </p>
                          <p className='text-sm text-pink-600 font-medium'>
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <span className='text-xs text-pink-500 font-medium bg-pink-100 px-2 py-1 rounded-full'>
                          {activity.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Floating Elements */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <motion.div
          animate={{
            x: [0, 100, 200, 300, 400],
            y: [0, -50, -100, -50, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1.5, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className='absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-30 blur-sm'
        />

        <motion.div
          animate={{
            x: [400, 300, 200, 100, 0],
            y: [0, 50, 100, 50, 0],
            rotate: [360, 270, 180, 90, 0],
            scale: [1.5, 1.2, 1, 1.2, 1.5]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className='absolute top-3/4 right-1/4 w-6 h-6 bg-gradient-to-r from-rose-400 to-red-400 rounded-full opacity-20 blur-sm'
        />

        <motion.div
          animate={{
            x: [200, 250, 300, 250, 200],
            y: [200, 150, 200, 250, 200],
            rotate: [0, 120, 240, 360],
            scale: [1, 1.3, 1, 0.8, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className='absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-40 blur-sm'
        />
      </div>
    </div>
  );
}