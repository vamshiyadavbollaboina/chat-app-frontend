import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ChatInput from '../components/ChatInput';
import TableResponse from '../components/TableResponse';
import AnswerFeedback from '../components/AnswerFeedback';
import { FaRobot, FaUser } from 'react-icons/fa';

const API_BASE_URL ="https://chat-app-backend-topaz-iota.vercel.app/api";


const ChatInterface = () => {
  const { sessionId } = useParams();
  const [history, setHistory] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    fetchHistory(sessionId);
  }, [sessionId]);

  const fetchHistory = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session/${id}`);
      const data = await response.json();
      setHistory(data.map(msg => ({ ...msg, feedback: msg.feedback || null })));
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    const newUserMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const assistantResponse = await response.json();

      const newAssistantMessage = {
        id: assistantResponse.id,
        type: 'assistant',
        content: assistantResponse.content,
        tabularData: assistantResponse.tabularData,
        feedback: assistantResponse.feedback || null,
        timestamp: new Date().toISOString(),
      };

      setHistory(prev => [...prev, newAssistantMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (index, type) => {
    const message = history[index];
    if (!message || message.type !== 'assistant') return;

    const newFeedback = message.feedback === type ? null : type;

    setHistory(prev => prev.map((msg, i) =>
      i === index ? { ...msg, feedback: newFeedback } : msg
    ));

    try {
      await fetch(`${API_BASE_URL}/messages/${message.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: newFeedback })
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main className="flex flex-col flex-grow relative transition-all duration-300">
        <header className="p-4 flex justify-between items-center border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200">
            Session: <span className="font-normal">{sessionId}</span>
          </h2>
          <ThemeToggle />
        </header>

        <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 pb-28">
          {history.length === 0 && !isLoading && (
            <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
              Start the conversation!
            </div>
          )}

          {history.map((message, index) => (
            <div key={message.id || index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start space-x-3 max-w-4xl transition-colors duration-300">
                {message.type === 'assistant'
                  ? <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white"><FaRobot /></div>
                  : <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaUser /></div>
                }

                <div
                  className={`p-4 rounded-xl shadow-md relative max-w-xl
                    ${message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50'
                    }`}
                  title={new Date(message.timestamp).toLocaleString()}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.type === 'assistant' && message.tabularData && (
                    <TableResponse tabularData={message.tabularData} />
                  )}

                  {message.type === 'assistant' && (
                    <div className="flex space-x-2 mt-2">
                      {['Agree','Thanks','Clear', 'Repeat', 'Explain', 'Confirm', 'Reject'].map(option => (
                        <button
                          key={option}
                          onClick={() => handleSendMessage(option)}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm
                                     hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.type === 'assistant' && (
                    <AnswerFeedback
                      initialFeedback={message.feedback}
                      onFeedback={(type) => handleFeedback(index, type)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xl p-4 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 shadow-md flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                <span className="ml-2">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default ChatInterface;
