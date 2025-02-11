"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, Heart, Github } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const HF_API_URL = "https://huggingface.co/api/models";

export default function Home() {
  const [models, setModels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  // Fetch models from HF API
  const fetchModels = async () => {
    if (loading) return; // Prevent duplicate requests
    setLoading(true);

    try {
      const response = await fetch(HF_API_URL);
      const data = await response.json();
      setModels((prev) => [...prev, ...data.slice(prev.length, prev.length + 10)]); // Append new models
    } catch (err) {
      console.error("Error fetching models:", err);
    } finally {
      setLoading(false);
    }
  };

  // Observer for Infinite Scroll
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect(); // Disconnect old observer

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchModels(); // Load more models when the last card is visible
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading]);

  return (
    <div className={`flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4 ${inter.className} relative`}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full p-4 flex justify-between items-center bg-gray-800/80 backdrop-blur-md shadow-lg z-10 border-b border-blue-500/20">
        <h1 className="text-2xl font-bold text-blue-400 pl-4">
          <strong>HF-TOK</strong>
        </h1>
        <a href="https://github.com/Dhanush-K-Gowda/hf-tok" target="_blank" rel="noopener noreferrer">
          <button className="px-8 py-2 flex items-center space-x-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </button>
        </a>
      </nav>

      {/* Model Cards with Infinite Scroll */}
      <div className="w-full max-w-md mt-20">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="transition-transform duration-500 mb-6"
            ref={index === models.length - 1 ? lastElementRef : null} // Observe last card
          >
            <Card className="rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-md border border-blue-500/20">
              <CardContent className="p-8 flex flex-col items-center text-center">
              <h2 className="text-2xl font-extrabold tracking-wide text-blue-400 truncate max-w-full">
                {model.id}
                </h2>
                <p className="text-sm text-blue-300 mt-2 italic">{model.pipeline_tag}</p>
                <p className="text-sm text-gray-300 mt-4">
                  {model.cardData?.description || "No description available."}
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <p className="text-xs text-gray-400 flex items-center">
                    <Heart className="text-red-400 mr-1 h-4 w-4" /> {model.likes}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center">
                    <Download className="text-blue-400 mr-1 h-4 w-4" /> {model.downloads}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-2">Author: {model.author || "Unknown"}</p>
                <a href={`https://huggingface.co/${model.id}`} target="_blank" rel="noopener noreferrer">
                  <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear mt-4">
                    View on Hugging Face
                  </button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-blue-400 mt-4 animate-pulse">Loading more models...</p>}

      {/* Footer */}
      <footer className="fixed bottom-4 text-sm text-blue-400">
        Made with ❤️ by
        <a href="https://x.com/gowda_dhanush03" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-blue-500">
          Dhanush
        </a>
      </footer>
    </div>
  );
}
