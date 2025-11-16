import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://chat-app-backend-topaz-iota.vercel.app/api';

const LandingPage = () => {
  const navigate = useNavigate();

  const startNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new-chat`);
      const data = await response.json();
      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("Error starting new chat:", error);
      alert("Could not connect to backend server. Please ensure the backend is running.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 transition-all">
      
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white animate-fadeIn">
        Simplified Chat App
      </h1>

      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 animate-slideUp">
        A demonstration of React, TailwindCSS, and Node.js (Express)
      </p>
      
      <button
        onClick={startNewChat}
        className="px-10 py-4 text-xl md:text-2xl font-bold rounded-full bg-green-600 text-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-2xl animate-bounce"
      >
        Start New Chat
      </button>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-80 h-80 bg-purple-400 opacity-20 rounded-full absolute -top-20 -left-20 animate-pulse-slow"></div>
        <div className="w-60 h-60 bg-blue-400 opacity-20 rounded-full absolute bottom-10 right-10 animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default LandingPage;
