"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, Heart, Github } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const HF_API_URL = "https://huggingface.co/api/models";

export default function Home() {
  const [models, setModels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    fetch(HF_API_URL)
      .then((res) => res.json())
      .then((data) => setModels(data.slice(0, 10))) // Fetch only a few for now
      .catch((err) => console.error(err));
  }, []);

  // Handle Scroll Event (Desktop)
  const handleScroll = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaY) < 50) return;
    setCurrentIndex((prev) =>
      event.deltaY > 0 ? (prev + 1) % models.length : (prev - 1 + models.length) % models.length
    );
  };

  // Handle Touch Events (Mobile)
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.touches[0].clientY);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!touchStart) return;
    const deltaY = touchStart - event.touches[0].clientY;
    if (Math.abs(deltaY) > 50) {
      setCurrentIndex((prev) =>
        deltaY > 0 ? (prev + 1) % models.length : (prev - 1 + models.length) % models.length
      );
      setTouchStart(null);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4 ${inter.className} relative`}
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Semi-transparent grid background */}
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full p-4 flex justify-between items-center bg-gray-800/80 backdrop-blur-md shadow-lg z-10 border-b border-blue-500/20">
        <h1 className="text-2xl font-bold text-blue-400 pl-4">
          <strong>HF-TOK</strong>
        </h1>
        <a
          href="https://github.com/Dhanush-K-Gowda/hf-tok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-8 py-2 flex items-center space-x-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </button>
        </a>
      </nav>

      {/* Model Cards */}
      {models.length > 0 && (
        <motion.div
          key={`${models[currentIndex].id}-${currentIndex}`} // Ensure re-render on index change
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="w-full max-w-md transition-transform duration-500 mt-20"
        >
          <Card className="rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-md border border-blue-500/20">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-extrabold tracking-wide text-blue-400">{models[currentIndex].id}</h2>
              <p className="text-sm text-blue-300 mt-2 italic">{models[currentIndex].pipeline_tag}</p>
              <p className="text-sm text-gray-300 mt-4">
                {models[currentIndex].cardData?.description || "No description available."}
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <p className="text-xs text-gray-400 flex items-center">
                  <Heart className="text-red-400 mr-1 h-4 w-4" /> {models[currentIndex].likes}
                </p>
                <p className="text-xs text-gray-400 flex items-center">
                  <Download className="text-blue-400 mr-1 h-4 w-4" /> {models[currentIndex].downloads}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Author: {models[currentIndex].author || "Unknown"}</p>
              <a
                href={`https://huggingface.co/${models[currentIndex].id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear mt-4">
                  View on Hugging Face
                </button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-4 text-sm text-blue-400">
        Made with ❤️ by
        <a
          href="https://x.com/gowda_dhanush03"
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-1 hover:text-blue-500"
        >
          Dhanush
        </a>
      </footer>
    </div>
  );
}
