"use client"

import React, { useEffect } from 'react';
import * as THREE from 'three';
import Vanta from 'vanta/dist/vanta.globe.min.js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';

const Home = () => {
  useEffect(() => {
    const vantaEffect = Vanta({
      el: '#vanta-bg',
      THREE: THREE,
      color: 0xD65600, // Accent color
      backgroundColor: 0x1a1a1a, // Dark background
      depth: 0.7,
      scale: 1.5,
      scaleMobile: 1.5,
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  // Variants for container and elements
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Head>
        <title>Real-Time Solar Flare Monitoring</title>
        <meta name="description" content="Get the latest insights and predictions on solar flare activity. Stay informed about space weather events that impact our modern world." />
      </Head>

      <div  suppressHydrationWarning={true} id="vanta-bg" className="min-h-screen relative bg-black text-white">
        {/* Overlay for improved text contrast */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        >
          <div className="text-center max-w-3xl">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-orange-500 mb-6 tracking-tight drop-shadow-lg"
              variants={headerVariants}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Real-Time Solar Flare Monitoring
            </motion.h1>
            <motion.p 
              className="text-lg md:text-2xl text-gray-300 mb-10 leading-relaxed drop-shadow-md"
              variants={paragraphVariants}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Get the latest insights and predictions on solar flare activity.
              Stay informed about space weather events that impact our modern world.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Link 
                  href="/dashboard"
                  className="px-8 py-3 bg-orange-500 text-black font-semibold rounded-full transition duration-300 ease-in-out"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            </div>
            {/* Additional Button Below */}
            <div className="mt-6">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Link 
                  href="/learn"
                  className="px-8 py-3 bg-orange-500 text-black font-semibold rounded-full transition duration-300 ease-in-out"
                >
                  Why Care?
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 z-10">
          <p>&copy; 2025 Solar Flare Monitoring. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;
