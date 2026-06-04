import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skull, Clock, Users, ArrowLeft } from 'lucide-react';
import api from '../api';

const QuestDetails = () => {
  const { id } = useParams();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quests/${id}`)
      .then(response => {
        setQuest(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-wonderTeal font-horror text-3xl animate-pulse">Ищем следы...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blood font-horror text-3xl">Кошмар не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 relative z-10">
      <div className="max-w-5xl mx-auto">
        <Link to="/quests" className="inline-flex items-center gap-2 text-gray-400 hover:text-wonderTeal transition-colors mb-8 uppercase tracking-widest text-sm font-sans">
          <ArrowLeft size={18} /> Вернуться к выбору
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 border border-darkblood rounded-lg p-8 backdrop-blur-md shadow-[0_0_30px_rgba(138,3,3,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blood via-darkblood to-void"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-4xl md:text-6xl font-horror text-white tracking-widest">{quest.name}</h1>
            <Link to={`/book/${quest.id}`}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px #8a0303' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blood text-white font-bold uppercase tracking-widest rounded transition-all"
              >
                Бронировать
              </motion.button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {quest.tags && quest.tags.map(tag => (
              <span key={tag.id} className="text-sm px-3 py-1 bg-blood/10 text-wonderYellow border border-wonderYellow/30 rounded uppercase tracking-wider">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y border-gray-800 py-6">
            <div className="flex items-center gap-4">
              <Skull className="text-wonderTeal" size={32} />
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">Уровень страха</div>
                <div className="text-xl font-bold">Высокий</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="text-wonderTeal" size={32} />
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">Команда</div>
                <div className="text-xl font-bold">2 - 6 жертв</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-wonderTeal" size={32} />
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">Время</div>
                <div className="text-xl font-bold">90 минут</div>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none font-sans text-gray-300 text-lg leading-relaxed font-light tracking-wide">
            {quest.info}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestDetails;