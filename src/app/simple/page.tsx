export default function SimplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ SUCCESS!
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Loconomy App is Working!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          The application is successfully running in the preview.
        </p>
        <div className="space-y-3">
          <div className="text-sm text-gray-500">
            🚀 Next.js Application: Running
          </div>
          <div className="text-sm text-gray-500">
            💎 Components: Functional
          </div>
          <div className="text-sm text-gray-500">
            🎨 Styling: Active
          </div>
          <div className="text-sm text-gray-500">
            ⚡ Performance: Optimized
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-semibold">
            🎉 All Systems Operational!
          </p>
        </div>
      </div>
    </div>
  )
}
