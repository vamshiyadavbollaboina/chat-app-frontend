import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft, FiPlus, FiTrash2 } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000/api';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [sessions, setSessions] = useState([]);
  const [deletedIds, setDeletedIds] = useState(() => JSON.parse(localStorage.getItem('deletedSessions') || '[]'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const startNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/new-chat`);
      const data = await res.json();

      const createdAt = data.createdAt || new Date().toISOString();
      const newSession = {
        id: data.sessionId,
        createdAt,
        title: `Chat - ${new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
      };

      setSessions(prev => [...prev, newSession]);
      navigate(`/chat/${newSession.id}`);
    } catch (err) {
      console.error("Error starting new chat:", err);
    }
  }

  const deleteSession = (id) => {
    setDeletedIds(prev => {
      const updated = [...prev, id];
      localStorage.setItem('deletedSessions', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredSessions = sessions.filter(s => !deletedIds.includes(s.id));

  return (
    <div className={`flex-shrink-0 h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-r dark:border-gray-700 overflow-y-auto fixed md:static z-20`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          {!isCollapsed && <h1 className="text-xl font-bold dark:text-white">Chat App</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200">
            {isCollapsed
              ? <FiChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
              : <FiChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
            }
          </button>
        </div>

        <div className="mb-4">
          <button onClick={startNewChat} className="w-full p-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center">
            <FiPlus className="mr-2" /> {!isCollapsed && 'New Chat'}
          </button>
        </div>

        {!isCollapsed && <h2 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">Past Sessions</h2>}
        <div className="flex-grow overflow-y-auto">
          {filteredSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between mb-2">
              <NavLink
                to={`/chat/${session.id}`}
                className={({ isActive }) =>
                  `flex-grow block p-3 rounded-lg truncate transition-all duration-200 font-medium ${isActive
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'}`
                }
                title={session.id}
              >
                {isCollapsed
                  ? <span className="text-sm text-gray-500">{session.id.slice(0, 4)}</span>
                  : session.title
                }
              </NavLink>
              {!isCollapsed && (
                <button onClick={() => deleteSession(session.id)} className="ml-2 p-2 rounded-lg transition-all hover:bg-red-100 dark:hover:bg-red-700" title="Delete Session">
                  <FiTrash2 className="text-red-500 dark:text-red-400" size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
<div className="mt-4 pt-4 border-t dark:border-gray-700">
  {!isCollapsed && (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm shadow-md">
        BV
      </div>
      <div>
        <p className="font-medium text-sm dark:text-gray-400">Bollaboina Vamshi Yadav</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Pro Member</p>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Sidebar;

