'use client';

import { useState, useEffect } from 'react';

export default function MinimalHomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Loconomy
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Local Services Platform
        </p>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Future of Services
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Connect with trusted local service professionals through our intelligent platform.
          </p>

          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-sky-600 transition-all">
              Find Services
            </button>
            <button className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all">
              Become a Provider
            </button>
          </div>
        </div>

        <div className="mt-8 text-gray-600">
          <p>Client Status: {isClient ? 'Loaded' : 'Loading...'}</p>
          <p>Current Time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
