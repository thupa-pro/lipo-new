export default function TestPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          ✅ App is Working!
        </h1>
        <p className="text-xl text-gray-600">
          Loconomy is running successfully
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>Next.js:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>React:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Tailwind CSS:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>TypeScript:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
          </div>
        </div>
        <div className="space-x-4">
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
          <a 
            href="/ai-personalization" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View AI Features
          </a>
        </div>
      </div>
    </div>
  );
}
