import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Staff = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  
  // Состояния для модального окна редактирования
  const [editingCell, setEditingCell] = useState(null); // { questId, dayId, questName, dayName }
  const [selectedActorIds, setSelectedActorIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    api.get('/staff').then(res => setData(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Поиск душ...</div>;

  const days = [
    { id: 1, name: 'Пн' },
    { id: 2, name: 'Вт' },
    { id: 3, name: 'Ср' },
    { id: 4, name: 'Чт' },
    { id: 5, name: 'Пт' },
    { id: 6, name: 'Сб' },
    { id: 0, name: 'Вс' }
  ];

  const fullDays = { 1: "Понедельник", 2: "Вторник", 3: "Среда", 4: "Четверг", 5: "Пятница", 6: "Суббота", 0: "Воскресенье" };

  // Открытие модалки
  const openEditModal = (questId, dayId, currentActors) => {
    if (user?.role !== 'admin') return;
    
    setEditingCell({
      questId,
      dayId,
      questName: data.quests[questId],
      dayName: fullDays[dayId]
    });
    // Заполняем массив ID уже выбранных актеров
    setSelectedActorIds(currentActors.map(a => a.id));
  };

  // Переключение чекбокса в модалке
  const toggleActor = (actorId) => {
    setSelectedActorIds(prev => 
      prev.includes(actorId) 
        ? prev.filter(id => id !== actorId) 
        : [...prev, actorId]
    );
  };

  // Отправка данных на сервер
  const saveSchedule = async () => {
    setIsSaving(true);
    try {
      await api.post('/staff/update_schedule', {
        quest_id: editingCell.questId,
        day_of_week: editingCell.dayId,
        actor_ids: selectedActorIds
      });
      await loadData(); // Перезагружаем данные после сохранения
      setEditingCell(null);
    } catch (error) {
      console.error("Ошибка при сохранении расписания", error);
      alert("Не удалось сохранить расписание.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="border-b border-gray-900 pb-6 mb-10 flex justify-between items-end">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Управление персоналом</h1>
        <Link to="/dashboard" className="text-wonderTeal hover:text-wonderYellow uppercase tracking-widest text-sm font-sans transition-colors">
          Вернуться в убежище
        </Link>
      </div>

      {user?.role === 'admin' && (
        <div className="mb-6 p-4 bg-blood/10 border border-blood text-textPrimary font-sans text-sm tracking-widest uppercase inline-block">
          Режим управления: Нажмите на ячейку таблицы, чтобы изменить состав смены
        </div>
      )}

      <div className="bg-surface border border-gray-900 p-6 mb-10 overflow-x-auto">
        <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Сводное расписание по квестам</h3>
        <table className="w-full text-center font-sans text-sm">
          <thead className="bg-void border-b border-gray-800">
            <tr>
              <th className="p-4 text-textMuted uppercase tracking-widest font-normal text-left">Квест</th>
              {days.map(d => <th key={d.id} className="p-4 text-textPrimary uppercase tracking-widest font-normal">{d.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {Object.keys(data.quests).map(questId => (
              <tr key={questId} className="hover:bg-void transition-colors">
                <td className="p-4 text-textPrimary font-bold text-left">{data.quests[questId]}</td>
                {days.map(d => {
                  const actors = data.schedule_grid[questId][d.id] || [];
                  const isHoverable = user?.role === 'admin';
                  
                  return (
                    <td 
                      key={d.id} 
                      onClick={() => openEditModal(questId, d.id, actors)}
                      className={`p-4 transition-colors ${isHoverable ? 'cursor-pointer hover:bg-blood/20' : ''}`}
                      title={isHoverable ? "Нажмите для редактирования" : ""}
                    >
                      {actors.length > 0 ? (
                        <span className="text-wonderTeal font-bold">{actors.map(a => a.name).join(', ')}</span>
                      ) : (
                        <span className="text-gray-800">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Персональные графики актеров</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.actors.map(actor => (
          <div key={actor.id} className="bg-surface border border-gray-800 p-6 relative overflow-hidden group hover:border-wonderTeal transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-wonderTeal/5 rounded-full blur-[30px]"></div>
            <h4 className="text-2xl font-horror text-wonderTeal mb-1 group-hover:text-wonderYellow transition-colors">{actor.name} {actor.last_name}</h4>
            <p className="text-textMuted font-sans text-xs uppercase tracking-widest mb-6">ID сотрудника: {actor.id}</p>
            
            <ul className="space-y-2 font-sans text-sm">
              {days.map(d => {
                const actorSchedules = actor.schedules.filter(s => s.day === d.id);
                if (actorSchedules.length === 0) return null;
                const questNames = actorSchedules.map(s => data.quests[s.quest_id]).join(', ');
                return (
                  <li key={d.id} className="flex justify-between border-b border-gray-900 pb-2">
                    <span className="text-textMuted">{fullDays[d.id]}</span>
                    <span className="text-textPrimary text-right pl-4">{questNames}</span>
                  </li>
                );
              })}
              {actor.schedules.length === 0 && <li className="text-gray-700">Нет назначенных смен</li>}
            </ul>
          </div>
        ))}
      </div>

      {/* Модальное окно редактирования */}
      <AnimatePresence>
        {editingCell && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-blood w-full max-w-md p-6 shadow-[0_0_30px_rgba(138,3,3,0.3)] relative"
            >
              <button 
                onClick={() => setEditingCell(null)}
                className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-sans font-bold text-blood uppercase tracking-widest mb-2">Назначение смены</h3>
              <p className="text-textMuted font-sans text-sm mb-6">
                <span className="text-wonderTeal">{editingCell.questName}</span> — {editingCell.dayName}
              </p>

              <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {data.actors.map(actor => (
                  <label key={actor.id} className="flex items-center gap-3 p-3 border border-gray-800 hover:border-wonderTeal transition-colors cursor-pointer bg-void">
                    <input 
                      type="checkbox" 
                      checked={selectedActorIds.includes(actor.id)}
                      onChange={() => toggleActor(actor.id)}
                      className="w-5 h-5 accent-blood bg-void border-gray-800 cursor-pointer"
                    />
                    <span className="text-textPrimary font-sans tracking-widest uppercase text-sm">
                      {actor.name} {actor.last_name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingCell(null)}
                  className="flex-1 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white font-sans uppercase tracking-widest text-xs font-bold transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={saveSchedule}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-blood text-white font-sans uppercase tracking-widest text-xs font-bold hover:bg-darkblood transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Staff;