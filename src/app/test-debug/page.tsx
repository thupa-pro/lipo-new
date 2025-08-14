'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Capture any runtime errors
    const errorHandler = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `${event.message} at ${event.filename}:${event.lineno}`]);
    };

    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-300 rounded">
          <h2 className="font-bold text-xl text-black">Client State</h2>
          <p>Is Client: {isClient ? 'Yes' : 'No'}</p>
          <p>Window defined: {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
          <p>Document defined: {typeof document !== 'undefined' ? 'Yes' : 'No'}</p>
        </div>

        <div className="p-4 border border-gray-300 rounded">
          <h2 className="font-bold text-xl text-black">Runtime Errors</h2>
          {errors.length === 0 ? (
            <p className="text-green-600">No errors detected</p>
          ) : (
            <ul className="text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border border-gray-300 rounded">
          <h2 className="font-bold text-xl text-black">Environment Variables</h2>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>Next.js Version: Checking...</p>
        </div>

        <div className="p-4 border border-gray-300 rounded">
          <h2 className="font-bold text-xl text-black">Test Components</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => alert('Button clicked')}
          >
            Test Button
          </button>
          <div className="mt-2 p-2 bg-gray-100 text-black">
            This is a test div with content
          </div>
        </div>
      </div>
    </div>
  );
}
