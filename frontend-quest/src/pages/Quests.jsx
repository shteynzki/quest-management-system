import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';

const Quests = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quests')
      .then(response => {
        setQuests(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки квестов:", error);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 relative z-10">
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-horror text-blood mb-16 text-center uppercase tracking-widest relative"
      >
        <span className="absolute -inset-2 bg-blood/10 blur-xl rounded-full z-0"></span>
        <span className="relative z-10">Доступные Кошмары</span>
      </motion.h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-wonderTeal font-horror text-3xl animate-pulse tracking-widest">
            Связь с потусторонним...
          </div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {quests.map((quest) => (
            <motion.div 
              key={quest.id} 
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-void border-2 border-darkblood rounded-sm p-1 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blood/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="absolute top-0 left-0 w-0 h-1 bg-wonderTeal group-hover:w-full transition-all duration-700 ease-out"></div>
              <div className="absolute bottom-0 right-0 w-0 h-1 bg-wonderYellow group-hover:w-full transition-all duration-700 ease-out"></div>

              <div className="bg-black/80 h-full p-6 flex flex-col z-10 relative">
                <div className="flex-grow">
                  <h3 className="text-3xl font-horror text-white mb-4 uppercase tracking-widest group-hover:text-blood transition-colors duration-300">
                    {quest.name}
                  </h3>
                  
                  <div className="w-12 h-1 bg-darkblood mb-4 group-hover:bg-wonderTeal transition-colors duration-300"></div>

                  <p className="text-gray-400 font-sans text-lg mb-6 line-clamp-4 font-light leading-relaxed">
                    {quest.info}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {quest.tags && quest.tags.slice(0, 4).map(tag => (
                      <span 
                        key={tag.id} 
                        className="text-xs px-2 py-1 bg-void border border-gray-800 text-gray-500 rounded-sm uppercase tracking-widest font-sans"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/quests/${quest.id}`}
                  className="block w-full py-4 text-center bg-darkblood/40 border border-blood text-white font-sans font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-blood hover:shadow-[0_0_20px_#8a0303]"
                >
                  Шагнуть во тьму
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Quests;