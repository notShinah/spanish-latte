"use client";

import { useState, useEffect } from "react";

type Memory = {
  id: string;
  date: string;
  chat: string;
};

type Hobby = {
  title: string;
  icon: string;
};

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hobbies: Hobby[] = [
    { title: "Painting", icon: "/images/patterns/paint-brush.png" },
    { title: "Crochet", icon: "/images/patterns/crochet.png" },
    { title: "Baking", icon: "/images/patterns/cake.png" },
    { title: "Red Onion", icon: "/images/patterns/red-onion.png" },
    { title: "Cats", icon: "/images/cats/cat-icon.png" },
  ];

  useEffect(() => {
    try {
      const fetchedMemories: Memory[] = [
        {
          id: "1",
          date: "Jan 12, 2026",
          chat: "Hi! I saw your Bumble profile… and I had to say hello ❤️",
        },
        {
          id: "2",
          date: "Jan 15, 2026",
          chat: "I can’t believe we’ve been chatting nonstop for days 😄",
        },
        {
          id: "3",
          date: "Feb 1, 2026",
          chat: "I love talking to you… you make my days brighter 🌞",
        },
      ];
      setMemories(fetchedMemories);
    } catch (e) {
      console.error(e);
      setError("Failed to load your memories. Please refresh the page.");
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-semibold text-red-500 mb-4">
          {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="relative bg-[#FFF9F4] min-h-screen py-12 px-6 md:px-16 lg:px-24">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-handwriting text-[#F77F7F] mb-4">
          Our Chat Scrapbook ❤️
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          A little digital scrapbook of our conversations and memories from
          Bumble. Every chat is a story.
        </p>
      </section>

      {/* Abstract / Watercolor background */}
      <img
        src="/images/patterns/watercolor1.png"
        className="absolute top-10 left-0 w-64 opacity-20 -z-10"
      />
      <img
        src="/images/patterns/watercolor2.png"
        className="absolute bottom-20 right-0 w-72 opacity-25 -z-10"
      />

      {/* Chat Memory Cards */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
        {memories.map((memory, i) => (
          <div
            key={memory.id}
            className="relative bg-white rounded-2xl p-6 shadow-lg border transition transform"
          >
            <div
              className={`p-4 rounded-xl ${
                i % 2 === 0 ? "bg-[#F77F7F] text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-base md:text-lg leading-relaxed">{memory.chat}</p>
            </div>
            <p className="text-gray-500 mt-3 text-sm text-right">{memory.date}</p>
          </div>
        ))}
      </section>

      {/* Floating Cats */}
      <img
        src="/images/cats/cat1.png"
        className="absolute top-12 left-8 w-16 animate-bounce"
        alt="cat sticker"
      />
      <img
        src="/images/cats/cat2.png"
        className="absolute bottom-24 right-12 w-20 animate-pulse"
        alt="cat sticker"
      />

      {/* Hobby Icons */}
      <section className="flex gap-8 mt-20 justify-center flex-wrap">
        {hobbies.map((hobby) => (
          <div key={hobby.title} className="flex flex-col items-center mb-4">
            <img
              src={hobby.icon}
              className="w-16 h-16 mb-2"
              alt={hobby.title}
            />
            <p className="text-gray-700 text-sm md:text-base">{hobby.title}</p>
          </div>
        ))}
      </section>
    </div>
  );
}