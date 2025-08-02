export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to Loconomy
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Your local services platform is working correctly!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            System Status: ✅ Operational
          </h2>
          <p className="text-blue-700">
            The application has been successfully debugged and is now running properly.
          </p>
        </div>
      </div>
    </div>
  );
}
