"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Camera, Palette, Target, Star } from "lucide-react";

type GameCard = {
  id: string;
  title: string;
  heart: string;
  description: string;
};

type Cat = {
  src: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  width: number;
  animationDuration: string;
  animationDelay: string;
  rotate: string;
};

export default function Home() {
  const [games, setGames] = useState<GameCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const gameCards: GameCard[] = [
          {
            id: "1",
            title: "Find the Cats",
            heart: "/images/patterns/heart.png",
            description: "Spot all the hidden cats before time runs out!"
          },
          {
            id: "2",
            title: "Paint Together",
            heart: "/images/patterns/heart2.png",
            description: "Create beautiful art with friends"
          },
          {
            id: "3",
            title: "Catch My Heart",
            heart: "/images/patterns/heart3.png",
            description: "A romantic adventure awaits"
          },
          {
            id: "4",
            title: "Photobooth",
            heart: "/images/patterns/heart4.png",
            description: "Capture memories with fun stickers"
          },
        ];

        if (!gameCards.length) throw new Error("Games failed to load");
        setGames(gameCards);

        // Floating cats in background
        const catSources = [
          "/images/cats/cat1.png",
          "/images/cats/cat2.png",
          "/images/cats/cat1.png",
          "/images/cats/cat2.png",
        ];

        const hydratedCats: Cat[] = catSources.map((src) => ({
          src,
          position: {
            top: `${Math.random() * 70 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          },
          width: 40 + Math.floor(Math.random() * 30),
          animationDuration: `${2 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 2}s`,
          rotate: `${Math.random() * 20 - 10}deg`,
        }));

        setCats(hydratedCats);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Something went wrong loading the games or cats.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50">
        <Card className="max-w-md w-full border-pink-200 shadow-xl shadow-pink-100/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-pink-800">Oops! 💔</h2>
            <p className="text-pink-600 mb-4 font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
            >
              Try Again ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Mini Moments
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-lg text-pink-700 max-w-2xl mx-auto font-medium">
            Discover delightful games and create unforgettable memories.
            Tap a heart to begin your romantic adventure! 💖
          </p>
        </motion.section>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse border-pink-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-32 bg-pink-100 rounded-lg mb-4"></div>
                  <div className="h-4 bg-pink-100 rounded mb-2"></div>
                  <div className="h-3 bg-pink-100 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {games.map((game, i) => {
              const gameIcons = [<Target key="1" />, <Palette key="2" />, <Heart key="3" />, <Camera key="4" />];
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/game/${game.id}`}>
                    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-pink-100/50 border-2 border-pink-200 hover:border-pink-400 bg-gradient-to-br from-white to-pink-50/30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <motion.img
                              src={game.heart}
                              alt={`${game.title} heart`}
                              className="w-20 h-20 object-contain drop-shadow-lg"
                            />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                              {gameIcons[i]}
                              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            </div>
                          </motion.div>
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2 group-hover:text-pink-600 transition-colors text-pink-800">
                          {game.title}
                        </h3>
                        <p className="text-sm text-pink-600 text-center font-medium">
                          {game.description}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full text-xs font-semibold text-pink-700 border border-pink-200">
                            Play Now ✨
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.section>
        )}

        {/* Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Memory Gallery
              </h2>
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-pink-700 font-medium">
              Cherished moments captured in our romantic games 💕
            </p>
          </div>
          <Gallery />
        </motion.section>
      </div>

      {/* Floating background cats */}
      {cats.map((cat, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none -z-10 opacity-50"
          style={{
            top: cat.position.top,
            left: cat.position.left,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 12, -12, 0],
            scale: [1, 1.2, 1],
            x: [0, 10, -10, 0]
          }}
          transition={{
            duration: parseFloat(cat.animationDuration),
            repeat: Infinity,
            ease: "easeInOut",
            delay: parseFloat(cat.animationDelay),
          }}
        >
          <div className="relative">
            <img
              src={cat.src}
              alt="decorative cat"
              className="w-24 h-24 object-contain drop-shadow-2xl filter brightness-110"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-sm"
            />
          </div>
        </motion.div>
      ))}

      {/* 3D Floating Geometric Shapes */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
        <motion.div
          animate={{
            x: [0, 200, 400, 600, 800],
            y: [100, 50, 150, 100, 200],
            rotate: [0, 180, 360, 540, 720],
            scale: [0.5, 1, 1.5, 1, 0.5]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className='absolute w-6 h-6 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-20 blur-md'
          style={{ top: '20%', left: '10%' }}
        />

        <motion.div
          animate={{
            x: [800, 600, 400, 200, 0],
            y: [300, 250, 350, 300, 400],
            rotate: [720, 540, 360, 180, 0],
            scale: [1.5, 1, 0.5, 1, 1.5]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className='absolute w-8 h-8 bg-gradient-to-r from-rose-300 to-red-300 rounded-lg opacity-15 blur-lg'
          style={{ top: '60%', right: '15%' }}
        />

        <motion.div
          animate={{
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className='absolute w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-30 blur-sm'
          style={{ top: '40%', left: '70%' }}
        />

        <motion.div
          animate={{
            x: [0, 100, 200, 100, 0],
            y: [0, -50, -100, -50, 0],
            rotateZ: [0, 90, 180, 270, 360],
            scale: [0.8, 1.2, 1.6, 1.2, 0.8]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 15
          }}
          className='absolute w-5 h-5 bg-gradient-to-r from-rose-400 to-red-400 rounded-lg opacity-25 blur-md'
          style={{ bottom: '30%', left: '20%' }}
        />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 2, 1.5, 1],
            opacity: [0.1, 0.3, 0.5, 0.3, 0.1]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            delay: 20
          }}
          className='absolute w-12 h-12 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-10 blur-xl'
          style={{ top: '10%', right: '30%' }}
        />
      </div>
    </div>
  );
}

function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(firestore, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const urls = snapshot.docs.map(doc => doc.data().url as string);
        setImages(urls);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg animate-pulse border border-pink-200"></div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <p className="text-pink-700 font-medium">No memories yet. Start playing to create some magical moments! ✨</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.slice(0, 8).map((url, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="aspect-square overflow-hidden rounded-lg border-2 border-pink-200 shadow-lg hover:shadow-pink-100/50 transition-all duration-300 group"
        >
          <img
            src={url}
            alt={`Gallery image ${i + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="w-3 h-3 text-white" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}