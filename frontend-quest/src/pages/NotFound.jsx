import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] bg-blood/10 blur-[150px] rounded-full"
      ></motion.div>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-9xl font-horror text-blood mb-4 animate-glitch relative z-10"
      >
        404
      </motion.h1>

      <p className="text-2xl font-sans text-gray-400 mb-8 uppercase tracking-[0.2em] relative z-10">
        Здесь ничего нет. Кроме тьмы.
      </p>

      <Link
        to="/"
        className="px-8 py-3 border border-wonderTeal text-wonderTeal hover:bg-wonderTeal hover:text-black font-bold uppercase tracking-widest transition-all relative z-10"
      >
        Бежать обратно
      </Link>
    </div>
  );
};

export default NotFound;