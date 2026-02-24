"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type GameCard = {
  id: string;
  title: string;
  heart: string;
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
  const [hearts, setHearts] = useState<
    { id: string; heart: string; animationDuration: string; animationDelay: string }[]
  >([]);

  useEffect(() => {
    try {
      const gameCards: GameCard[] = [
        { id: "1", title: "Find the Cats", heart: "/images/patterns/heart.png" },
        { id: "2", title: "Paint Together", heart: "/images/patterns/heart2.png" },
        { id: "3", title: "Catch My Heart", heart: "/images/patterns/heart3.png" },
        { id: "4", title: "Secret Surprise", heart: "/images/patterns/heart4.png" },
      ];

      if (!gameCards.length) throw new Error("Games failed to load");
      setGames(gameCards);

      setHearts(
        gameCards.map((g) => ({
          id: g.id,
          heart: g.heart,
          animationDuration: `${2 + Math.random() * 1.5}s`,
          animationDelay: `${Math.random() * 2}s`,
        }))
      );

      // Floating cats in random positions in background
      const catSources = [
        "/images/cats/cat1.png",
        "/images/cats/cat2.png",
        "/images/cats/cat1.png",
        "/images/cats/cat2.png",
      ];

      const hydratedCats: Cat[] = catSources.map((src) => ({
        src,
        position: {
          top: `${Math.random() * 70 + 10}%`, // avoid top header (10%-80%)
          left: `${Math.random() * 80 + 10}%`, // 10%-90%
        },
        width: 40 + Math.floor(Math.random() * 30), // 40px-70px
        animationDuration: `${2 + Math.random() * 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        rotate: `${Math.random() * 20 - 10}deg`,
      }));

      setCats(hydratedCats);
    } catch (err) {
      console.error(err);
      setError("Something went wrong loading the games or cats.");
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="relative bg-[#FFF9F4] min-h-screen py-12 px-6 md:px-16 lg:px-24">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-handwriting text-[#F77F7F] mb-4">
          Hello, Bro!
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Tap a heart to unlock a little surprise.
        </p>
      </section>

      {/* Game Hearts */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
        {games.map((game, i) => {
          const heartStyle = hearts.find((h) => h.id === game.id);
          return (
            <Link key={game.id} href={`/game/${game.id}`}>
              <div className="relative bg-white rounded-2xl p-10 shadow-lg border hover:shadow-xl transition cursor-pointer">
                <div
                  className={`rounded-xl p-10 flex items-center justify-center ${
                    (Math.floor(i / 2) + i % 2) % 2 === 0
                      ? "bg-[#F9A8A8]"
                      : "bg-[#F1F5F9]"
                  }`}
                >
                  {heartStyle && (
                    <img
                      src={heartStyle.heart}
                      className="w-20 heart-dance transition-transform duration-300 hover:scale-125"
                      alt="game heart"
                      style={{
                        animationDuration: heartStyle.animationDuration,
                        animationDelay: heartStyle.animationDelay,
                      }}
                    />
                  )}
                </div>
                <p className="text-gray-500 mt-4 text-center text-sm">
                  Tap to play
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Floating background cats */}
      {cats.map((cat, i) => (
        <div
          key={i}
          className="absolute pointer-events-none -z-10"
          style={{
            top: cat.position.top,
            left: cat.position.left,
          }}
        >
          <img
            src={cat.src}
            className="floating-cat blur-sm opacity-50"
            alt="cat"
            style={{
              width: `${cat.width * 1.4}px`,
              animationDuration: cat.animationDuration,
              animationDelay: cat.animationDelay,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const q = query(collection(firestore, "gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const urls = snapshot.docs.map(doc => doc.data().url as string);
      setImages(urls);
    };
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {images.map((url, i) => (
        <img key={i} src={url} className="rounded shadow-lg w-full object-cover" />
      ))}
    </div>
  );
}