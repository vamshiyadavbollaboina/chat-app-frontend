import { useState } from 'react';
import { FaPaperPlane ,FaSpinner} from 'react-icons/fa';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Generating response..." : "Ask a question..."}
          disabled={isLoading}
          className="flex-grow bg-transparent focus:outline-none p-2 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2 ml-2 rounded-lg transition-colors flex items-center justify-center
            ${!input.trim() || isLoading 
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
