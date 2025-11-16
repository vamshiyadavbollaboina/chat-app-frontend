import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const AnswerFeedback = ({ initialFeedback = null, onFeedback }) => {
  const [selected, setSelected] = useState(initialFeedback);

  useEffect(() => {
    setSelected(initialFeedback);
  }, [initialFeedback]);

  const handleClick = (type) => {
    const newSelection = selected === type ? null : type;
    setSelected(newSelection);
    onFeedback(newSelection);
  };

  return (
    <div className="flex space-x-3 mt-3">
      <button 
        onClick={() => handleClick('like')} 
        className={`
          p-2 rounded-full transition-colors
          ${selected === 'like' 
            ? 'bg-green-500 text-white' 
            : 'text-green-500 hover:bg-green-100 dark:hover:bg-gray-700'
          }
        `}
        title="Like Answer"
      >
        <FaThumbsUp size={20} />
      </button>
      <button 
        onClick={() => handleClick('dislike')} 
        className={`
          p-2 rounded-full transition-colors
          ${selected === 'dislike' 
            ? 'bg-red-500 text-white' 
            : 'text-red-500 hover:bg-red-100 dark:hover:bg-gray-700'
          }
        `}
        title="Dislike Answer"
      >
        <FaThumbsDown size={20} />
      </button>
    </div>
  );
};

export default AnswerFeedback;
