"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const onStart1 = () => {
    router.push('/dashboard');
  };

  const onStart2 = () => {
    window.open("https://study-mate-ecru.vercel.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D')" }}
    >
      <div className="bg-black bg-opacity-50 p-6 rounded-xl flex items-center justify-center mb-8">
        <h1 className="text-6xl font-extrabold text-white">StudyMate</h1>
      </div>
      <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-2xl text-center animate-fade-in max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-white">Have an Interview?</h2>
        <p className="text-lg text-gray-300 mb-8">Prepare and practice with AI-powered tools to ace your next interview.</p>
        <div className="grid grid-cols-2 gap-12 w-full">
          <motion.div 
            className="flex flex-col items-center text-center p-8 rounded-xl shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-r from-blue-500 to-purple-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onStart2}
          >
            <h2 className="text-3xl font-semibold mb-3 text-white">Prepare</h2>
            <p className="text-gray-100">Enhance your knowledge with AI-generated notes.</p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center text-center p-8 rounded-xl shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-r from-green-500 to-yellow-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onStart1}
          >
            <h2 className="text-3xl font-semibold mb-3 text-white">Practice</h2>
            <p className="text-gray-100">Sharpen your skills with mock interviews.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}