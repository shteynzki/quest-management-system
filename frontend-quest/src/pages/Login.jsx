import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Неверный email или пароль. Тьма не пускает вас.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-darkblood p-8 rounded-sm shadow-[0_0_30px_rgba(138,3,3,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blood via-darkblood to-void"></div>
        
        <h2 className="text-3xl font-horror text-textPrimary mb-8 text-center tracking-widest">ВХОД</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-blood/10 border border-blood text-blood text-sm font-sans tracking-wide text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-textMuted font-sans text-sm uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-3 font-sans focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood transition-all"
            />
          </div>
          
          <div>
            <label className="block text-textMuted font-sans text-sm uppercase tracking-widest mb-2">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-3 font-sans focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#8a0303' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-darkblood/60 border border-blood text-textPrimary font-sans font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_15px_#8a0303]"
          >
            Войти во тьму
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-textMuted font-sans text-sm tracking-wide">Еще не готовы? </span>
          <Link to="/register" className="text-wonderTeal hover:text-wonderYellow transition-colors font-sans text-sm uppercase tracking-widest ml-2">
            Регистрация
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;