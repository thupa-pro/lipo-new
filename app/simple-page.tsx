"use client";

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Loconomy - Style Test
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Basic Styling Test
          </h2>
          <p className="text-gray-600 mb-4">
            This page tests basic Tailwind CSS functionality.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Test Button
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-green-800 font-semibold">Green Card</h3>
            <p className="text-green-600">This should be styled properly.</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold">Red Card</h3>
            <p className="text-red-600">This should be styled properly.</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-purple-800 font-semibold">Purple Card</h3>
            <p className="text-purple-600">This should be styled properly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
