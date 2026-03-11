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
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-background">
        <Card className="max-w-md w-full border-accent shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white animate-ping" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">Oops! 💔</h2>
            <p className="text-muted-foreground mb-4 font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-accent hover:bg-accent/90 text-white shadow"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white animate-ping" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold">Mini Moments</h1>
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-lg max-w-2xl mx-auto font-medium text-muted-foreground">
            Discover delightful games and create unforgettable memories.
            Tap a heart to begin your red‑accented adventure!
          </p>
        </motion.section>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse border-accent/50 shadow">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded"></div>
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
                    <Card className="group cursor-pointer transition-all duration-300 border-2 border-accent bg-card hover:shadow-lg">
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
                              className="w-20 h-20 object-contain"
                            />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                              {gameIcons[i]}
                              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                            </div>
                          </motion.div>
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2 text-foreground group-hover:text-accent transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center font-medium">
                          {game.description}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="px-3 py-1 bg-accent rounded-full text-xs font-semibold text-white">
                            Play Now
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

      </div>

        {/* footer spacing */}
      <div className="h-20"></div>
    </div>
  );
}