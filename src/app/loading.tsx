const Loading = () => {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-200">
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </div>
      </main>
    );
  };
  
  export default Loading;
  