"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, you'd handle authentication here
      console.log("Login attempt:", { email, password });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 px-4 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <motion.div
          animate={{
            x: [0, 50, 100, 50, 0],
            y: [0, -30, -60, -30, 0],
            rotate: [0, 45, 90, 45, 0],
            scale: [1, 1.2, 1.4, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-20 blur-md'
        />

        <motion.div
          animate={{
            x: [300, 250, 200, 250, 300],
            y: [100, 70, 100, 130, 100],
            rotate: [0, -45, -90, -45, 0],
            scale: [1.2, 1, 0.8, 1, 1.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className='absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-rose-300 to-red-300 rounded-full opacity-25 blur-md'
        />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 6
          }}
          className='absolute bottom-1/4 left-1/3 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-30 blur-sm'
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md perspective-1000"
      >
        <Card className="shadow-3d hover:shadow-3d-hover transition-all duration-500 border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-rose-400 to-red-400 rounded-full"
                />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Mini Moments
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                />
              </motion.div>
            </motion.div>
            <CardDescription className="text-pink-600 font-medium">
              Sign in to access the admin dashboard 💕
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-pink-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@minimoments.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/80 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-pink-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/80 backdrop-blur-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-pink-50 text-pink-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                >
                  <AlertDescription className="text-red-700 font-medium">
                    {error}
                  </AlertDescription>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50 hover:shadow-pink-300/50 transition-all duration-300 font-semibold py-3"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Signing in..." : "Sign In 💕"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-6 text-center text-sm text-pink-600 bg-pink-50/50 rounded-lg p-3 border border-pink-200"
            >
              <p className="font-medium">Demo credentials:</p>
              <p className="text-pink-700">admin@minimoments.com / password</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}