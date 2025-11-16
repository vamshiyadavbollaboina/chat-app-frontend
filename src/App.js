import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="m-0 p-0 min-h-screen flex flex-col items-center justify-center antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat/:sessionId" element={<ChatInterface />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
