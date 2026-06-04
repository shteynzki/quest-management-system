import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const Home = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quests')
      .then(res => {
        setQuests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Погружение во тьму...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-void text-textPrimary">
      <section className="relative pt-32 pb-20 px-4 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blood/20 via-void to-void z-0"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-horror text-blood tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(138,3,3,0.8)]">
            WONDERLAND
          </h1>
          <p className="text-xl md:text-2xl font-sans text-textPrimary uppercase tracking-[0.3em] mb-10">
            Сеть иммерсивных хоррор-квестов
          </p>
          <p className="text-textMuted text-lg max-w-2xl mx-auto mb-12">
            Грань между реальностью и вымыслом стерта. Мы создаем миры, где ваши самые потаенные страхи обретают форму. Готовы ли вы переступить порог?
          </p>
          <a href="#quests" className="inline-block bg-blood text-white font-sans font-bold uppercase tracking-widest px-8 py-4 transition-all hover:bg-darkblood hover:shadow-[0_0_20px_#8a0303]">
            Выбрать кошмар
          </a>
        </motion.div>
      </section>

      <section className="py-16 px-4 md:px-12 bg-surface border-y border-gray-900 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl text-blood mb-4 block border border-blood rounded-full w-16 h-16 flex items-center justify-center font-horror">1</span>
            <h3 className="text-xl font-sans font-bold text-wonderTeal uppercase tracking-widest mb-2">Выберите сюжет</h3>
            <p className="text-textMuted text-sm">От мистики до выживания. У каждого квеста своя уникальная атмосфера и уровень страха.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl text-blood mb-4 block border border-blood rounded-full w-16 h-16 flex items-center justify-center font-horror">2</span>
            <h3 className="text-xl font-sans font-bold text-wonderTeal uppercase tracking-widest mb-2">Соберите команду</h3>
            <p className="text-textMuted text-sm">В одиночку здесь не выжить. Берите с собой самых смелых друзей, которым готовы доверить жизнь.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl text-blood mb-4 block border border-blood rounded-full w-16 h-16 flex items-center justify-center font-horror">3</span>
            <h3 className="text-xl font-sans font-bold text-wonderTeal uppercase tracking-widest mb-2">Попытайтесь выжить</h3>
            <p className="text-textMuted text-sm">У вас есть ровно 90 минут, чтобы разгадать все тайны и выбраться из этого кошмара.</p>
          </div>
        </div>
      </section>

      <section id="quests" className="py-20 px-4 md:px-12 max-w-[1400px] mx-auto w-full z-10">
        <div className="border-b border-gray-900 pb-6 mb-12 text-center">
          <h2 className="text-4xl font-horror text-blood tracking-widest">Наши квесты</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {quests.map((quest) => (
            <Link to={`/quests/${quest.id}`} key={quest.id} className="group flex flex-col h-full bg-surface border border-gray-800 hover:border-blood transition-all duration-300">
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-horror text-textPrimary group-hover:text-blood transition-colors mb-4">{quest.name}</h3>
                <p className="text-textMuted text-sm line-clamp-4 flex-grow mb-6">{quest.info}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {quest.tags && quest.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest text-wonderTeal border border-gray-800 px-2 py-1 bg-void">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-800 p-4 text-center bg-void group-hover:bg-blood transition-colors">
                <span className="text-textPrimary group-hover:text-white font-sans text-xs uppercase tracking-[0.2em] font-bold">
                  Подробнее
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;