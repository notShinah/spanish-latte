'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, ArrowLeft, Sparkles } from 'lucide-react';

export default function GamePage() {
  return (
    <div className='min-h-screen bg-background text-foreground flex items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-2xl'
      >
        <Card className='shadow-lg border border-border'>
          <CardHeader className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <Gamepad2 className='h-12 w-12 text-accent' />
              <CardTitle className='text-3xl'>Games Coming Soon</CardTitle>
            </div>
            <CardDescription className='text-lg text-muted-foreground'>
              We're crafting simple experiences just for you. Stay tuned.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              {['Find the Cats','Paint Together','Catch My Heart','Photobooth'].map((title) => (
                <div key={title} className='p-4 rounded-lg bg-muted/50 text-center'>
                  <Sparkles className='h-8 w-8 text-accent mx-auto mb-2' />
                  <h3 className='font-semibold'>{title}</h3>
                </div>
              ))}
            </div>

            <Link href='/'>
              <Button size='lg' className='w-full sm:w-auto bg-accent text-white hover:bg-accent/90'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}