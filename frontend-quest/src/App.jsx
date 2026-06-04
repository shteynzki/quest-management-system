import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import Quests from './pages/Quests';
import QuestDetails from './pages/QuestDetails';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import CustomCursor from './components/CustomCursor';
import { AuthProvider, AuthContext } from './context/AuthContext';
import logo from './assets/logo.jpg';
import ReportForm from './pages/ReportForm';
import Motivation from './pages/Motivation';
import Schedule from './pages/Schedule';
import Staff from './pages/Staff';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-void flex justify-center items-center"><div className="text-wonderTeal font-horror text-2xl animate-pulse">Связь с потусторонним...</div></div>;
  return user ? children : <Navigate to="/login" />;
};

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood/20 blur-[120px] rounded-full animate-pulseSlow"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 text-center px-4 mt-16"
      >
        <motion.h1 className="text-5xl md:text-8xl font-horror text-textPrimary mb-6 tracking-widest relative">
          <span className="relative inline-block hover:animate-glitch hover:text-wonderTeal transition-colors duration-300">
            Добро пожаловать в
          </span>
          <br />
          <span className="text-blood drop-shadow-[0_0_15px_rgba(138,3,3,0.8)]">Wonderland</span>
        </motion.h1>

        <p className="max-w-2xl mx-auto text-textMuted text-lg md:text-2xl mb-10 font-sans font-light tracking-wide">
          Сеть хоррор-квестов, стирающих грань между игрой и безумием.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#8a0303', boxShadow: '0 0 20px #8a0303' }}
          whileTap={{ scale: 0.95 }}
          className="border border-blood text-blood px-10 py-4 rounded uppercase tracking-[0.2em] font-bold transition-all text-xl bg-void/50 backdrop-blur-sm"
        >
          <Link to="/quests" className="block w-full h-full">Выбрать кошмар</Link>
        </motion.button>
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 w-full p-4 flex justify-between items-center z-50 bg-void/90 backdrop-blur-md border-b border-gray-900">
      <Link to="/" className="flex items-center gap-4 group">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-[8px] bg-wonderTeal/20 group-hover:bg-wonderYellow/40 transition-colors"></div>
          <img 
            src={logo} 
            alt="Wonderland Logo" 
            className="relative h-12 w-12 rounded-full border border-wonderTeal shadow-[0_0_10px_#5bc0be] object-cover" 
          />
        </div>
        <span className="text-2xl font-horror text-textPrimary tracking-widest group-hover:text-blood transition-colors drop-shadow-md">
          Wonderland
        </span>
      </Link>
      
      <div className="space-x-8 text-sm font-sans text-textPrimary uppercase tracking-[0.15em] hidden md:flex items-center">
        <Link to="/" className="hover:text-wonderTeal hover:drop-shadow-[0_0_5px_#5bc0be] transition-all">Главная</Link>
        <Link to="/quests" className="hover:text-blood hover:drop-shadow-[0_0_5px_#8a0303] transition-all">Квесты</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-wonderYellow hover:drop-shadow-[0_0_5px_#f3c623] transition-all">Убежище</Link>
            <button onClick={logout} className="text-blood border border-blood px-3 py-1 hover:bg-blood hover:text-white transition-colors">Выйти</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-wonderYellow hover:drop-shadow-[0_0_5px_#f3c623] transition-all">Войти</Link>
        )}
      </div>
    </nav>
  );
};

const AppContent = () => (
  <div className="bg-void min-h-screen text-textPrimary relative selection:bg-wonderTeal selection:text-void">
    <CustomCursor />
    <div className="noise-overlay"></div>
    <Navbar />
    <Routes>
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/book/:id" element={<Booking />} />
      <Route path="/reports/new/:gameId" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
      <Route path="/" element={<Home />} />
      <Route path="/motivation" element={<ProtectedRoute><Motivation /></ProtectedRoute>} />
      <Route path="/quests" element={<Quests />} />
      <Route path="/quests/:id" element={<QuestDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
    </Routes>
  </div>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;