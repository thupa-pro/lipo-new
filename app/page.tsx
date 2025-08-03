export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to Loconomy</h1>
      <p className="mt-4 text-lg">The app is now running successfully!</p>
      <div className="mt-8 space-y-4">
        <a href="/browse" className="block text-blue-600 hover:underline">Browse Services</a>
        <a href="/become-provider" className="block text-blue-600 hover:underline">Become a Provider</a>
        <a href="/how-it-works" className="block text-blue-600 hover:underline">How It Works</a>
      </div>
    </div>
  );
}
