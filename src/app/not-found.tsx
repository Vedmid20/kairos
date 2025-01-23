const NotFoundPage = () => {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="text-center p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-7xl font-semibold mb-4">404</h1>
          <p className="text-lg mb-6">Oops! This page is missing.</p>
          <a href="/" className="text-lg font-semibold text-purple-500 hover:text-purple-400 transition-all duration-300">
            Return to Home
          </a>
        </div>
      </main>
    );
  }
  
  export default NotFoundPage;
  