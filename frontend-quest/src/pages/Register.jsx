import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Пароли не совпадают. Иллюзия рухнула.');
      return;
    }
    try {
      await api.post('/users', { user: formData });
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Ошибка при регистрации. Возможно, вы уже с нами.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-darkblood p-8 rounded-sm shadow-[0_0_30px_rgba(138,3,3,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blood via-darkblood to-void"></div>
        
        <h2 className="text-3xl font-horror text-textPrimary mb-8 text-center tracking-widest">РИТУАЛ</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-blood/10 border border-blood text-blood text-sm font-sans tracking-wide text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Имя</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-blood transition-all"
              />
            </div>
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Фамилия</label>
              <input
                type="text"
                name="last_name"
                required
                onChange={handleChange}
                className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-blood transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-blood transition-all"
            />
          </div>
          
          <div>
            <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Пароль</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-blood transition-all"
            />
          </div>

          <div>
            <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Повторите пароль</label>
            <input
              type="password"
              name="password_confirmation"
              required
              onChange={handleChange}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-blood transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#8a0303' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 mt-4 bg-darkblood/60 border border-blood text-textPrimary font-sans font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_15px_#8a0303]"
          >
            Заключить договор
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-textMuted font-sans text-sm tracking-wide">Уже с нами? </span>
          <Link to="/login" className="text-wonderTeal hover:text-wonderYellow transition-colors font-sans text-sm uppercase tracking-widest ml-2">
            Войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;