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
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [pipelineTags, setPipelineTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setFilteredModels(models.filter(model => model.pipeline_tag === selectedTag));
    } else {
      setFilteredModels(models);
    }
  }, [selectedTag, models]);

  // Fetch models from HF API
  const fetchModels = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(HF_API_URL);
      const data = await response.json();
      setModels((prev) => [...prev, ...data.slice(prev.length, prev.length + 10)]);
      extractPipelineTags(data);
    } catch (err) {
      console.error("Error fetching models:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique pipeline tags (limit to first 5-10 tags)
  const extractPipelineTags = (data: any[]) => {
    const uniqueTags = [...new Set(data.map((model) => model.pipeline_tag).filter(Boolean))].slice(0, 10);
    setPipelineTags(uniqueTags);
  };

  return (
    <div className={`flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4 ${inter.className} relative`}>
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

      {/* Filter Dropdown */}
      <div className="mt-20 mb-6">
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-gray-100 border border-blue-500 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          {pipelineTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Model Cards */}
      <div className="w-full max-w-md">
        {filteredModels.length > 0 ? (
          filteredModels.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="transition-transform duration-500 mb-6"
            >
              <Card className="rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-md border border-blue-500/20">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <h2 className="text-2xl font-extrabold tracking-wide text-blue-400 truncate max-w-full">{model.id}</h2>
                  <p className="text-sm text-blue-300 mt-2 italic">{model.pipeline_tag}</p>
                  <p className="text-sm text-gray-300 mt-4">{model.cardData?.description || "No description available."}</p>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <p className="text-xs text-gray-400 flex items-center">
                      <Heart className="text-red-400 mr-1 h-4 w-4" /> {model.likes}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center">
                      <Download className="text-blue-400 mr-1 h-4 w-4" /> {model.downloads}
                    </p>
                  </div>
                  <a href={`https://huggingface.co/${model.id}`} target="_blank" rel="noopener noreferrer">
                    <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear mt-4">
                      View on Hugging Face
                    </button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-blue-400 mt-4">No models found for the selected filter.</p>
        )}
      </div>

      {loading && <p className="text-blue-400 mt-4 animate-pulse">Loading more models...</p>}
    </div>
  );
}
