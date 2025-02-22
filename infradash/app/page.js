'use client'

import React, { useEffect } from 'react';
import * as THREE from 'three';
import Vanta from 'vanta/dist/vanta.globe.min.js';

const Home = () => {
  useEffect(() => {
    // Initialize Vanta.js when the component mounts
    const vantaEffect = Vanta({
      el: '#vanta-bg', // Target the element by its id
      THREE: THREE,    // Ensure THREE.js is available
      color: 0xD65600, // Customize the color
      backgroundColor: 0x1a1a1a, // Darker background for better contrast
      depth: 0.7, // Controls how zoomed in/out the effect is (default is 1)
      scale: 1.5,  // Adjust the zoom level, lower values zoom out
      scaleMobile: 1.5, // Adjust the zoom level for mobile
    });

    // Cleanup on unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div id="vanta-bg" className="min-h-screen flex flex-col items-center justify-start bg-black text-white">
      {/* Header Section */}
      <div className="text-center py-20 px-4 md:px-12 max-w-screen-lg mx-auto bg-transparent">
        <h1 className="text-5xl font-bold text-orange-500 mb-4 tracking-tight">
          Smart Infrastructure Monitoring
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 mb-8 leading-relaxed">
          Stay ahead by monitoring the health and performance of your infrastructure in real-time. <br />
          Gain valuable insights and optimize operations with smart analytics.
        </p>
        <button className="px-8 py-3 bg-orange-500 text-black font-semibold rounded-full hover:bg-orange-600 transition duration-300 ease-in-out">
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="w-full px-6 md:px-12 py-16 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Feature 1: Overview */}
          <div className="bg-transparent p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
            <h2 className="text-3xl font-semibold text-orange-500 mb-6">Real-time Dashboard</h2>
            <p className="text-gray-300 mb-6">
              Monitor the status of your infrastructure with live updates, performance metrics, and key alerts.
            </p>
            <button className="px-6 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition">
              Explore Dashboard
            </button>
          </div>

          {/* Feature 2: Live Metrics */}
          <div className="bg-transparent p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
            <h2 className="text-3xl font-semibold text-orange-500 mb-6">Live Metrics</h2>
            <p className="text-gray-300 mb-6">
              Track system performance, uptime, and alerts to maintain peak health and prevent issues before they arise.
            </p>
            <button className="px-6 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition">
              View Metrics
            </button>
          </div>

          {/* Feature 3: Security */}
          <div className="bg-transparent p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
            <h2 className="text-3xl font-semibold text-orange-500 mb-6">Enhanced Security</h2>
            <p className="text-gray-300 mb-6">
              Our infrastructure monitoring ensures robust security protocols, safeguarding your data and systems.
            </p>
            <button className="px-6 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-transparent w-full py-16 text-center">
        <h2 className="text-3xl font-semibold text-orange-500 mb-6">Start Monitoring Today!</h2>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          Take the next step in transforming your infrastructure management. Stay informed and proactive.
        </p>
        <button className="px-8 py-3 bg-orange-500 text-black font-semibold rounded-full hover:bg-orange-600 transition duration-300 ease-in-out">
          Get Started Now
        </button>
      </div>

      {/* Footer Section */}
      <div className="bg-black text-center py-4 mt-16 text-gray-500">
        <p>&copy; 2025 Smart Infrastructure Monitoring. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
