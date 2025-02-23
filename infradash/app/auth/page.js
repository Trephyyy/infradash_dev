"use client";
import { useState } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const particlesInit = async (engine) => {
    console.log(engine);
    // Check if checkVersion exists before calling loadFull
    if (engine && typeof engine.checkVersion === 'function') {
      await loadFull(engine);
    } else {
      console.warn("engine.checkVersion is not available. Skipping loadFull.");
    }
  };

  const particlesOptions = {
    background: {
      color: {
        value: "#000",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      collisions: { enable: false },
      move: {
        directions: "none",
        enable: true,
        outModes: { default: "out" },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80,
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'https://api.infradash.space/login' : 'https://api.infradash.space/register';
    
    try {
      // Step 1: Get the CSRF token from Laravel Sanctum
      await fetch('https://api.infradash.space/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',  // Important for Laravel to set the cookie
      });
  
      // Step 2: Make the login or registration request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',  // Send cookies with the request
      });
  
      const data = await response.json();
      console.log('Response:', data);
  
      // Handle successful response (e.g., redirect to dashboard)
      if (response.ok) {
        // Handle successful login/registration (e.g., store token, redirect)
      } else {
        // Handle error message from the backend
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error response (e.g., show error message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative z-10">
        {/* Tabs */}
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 focus:outline-none ${
              isLogin
                ? 'border-b-2 border-[#D65600] text-[#D65600] font-bold'
                : 'text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 focus:outline-none ${
              !isLogin
                ? 'border-b-2 border-[#D65600] text-[#D65600] font-bold'
                : 'text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="w-full bg-[#D65600] text-white py-2 rounded">
              Login
            </button>
          </form>
        ) : (
          // Register Form
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="w-full bg-[#D65600] text-white py-2 rounded">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
