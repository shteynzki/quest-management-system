import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [params, setParams] = useState({ view_mode: 'by_date', date: '', quest_id: '', start_date: '' });

  const loadData = () => {
    api.get('/schedule', { params }).then(res => setData(res.data));
  };

  useEffect(() => {
    loadData();
  }, [params]);

  const handleDateChange = (days) => {
    const d = new Date(data.date || data.start_date);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split('T')[0];
    
    if (data.view_mode === 'by_date') {
      setParams({ ...params, date: newDateStr });
    } else {
      setParams({ ...params, start_date: newDateStr });
    }
  };

  const cancelGame = async (gameId) => {
    if (window.confirm('Удалить эту бронь навсегда?')) {
      try {
        await api.delete(`/games/${gameId}`);
        loadData();
      } catch (err) {
        alert('Не удалось отменить бронь. Возможно, у вас нет прав.');
      }
    }
  };

  if (!data) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Изучаем скрижали...</div>;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-[1400px] mx-auto relative z-10">
      <div className="border-b border-gray-900 pb-6 mb-8 flex justify-between items-end">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Служебное расписание</h1>
        <Link to="/dashboard" className="text-wonderTeal hover:text-wonderYellow uppercase tracking-widest text-sm font-sans transition-colors">
          Вернуться в убежище
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setParams({ view_mode: 'by_date', date: '', quest_id: '', start_date: '' })}
          className={`px-6 py-2 uppercase tracking-widest text-sm font-bold font-sans transition-colors ${data.view_mode === 'by_date' ? 'bg-blood text-white' : 'bg-void border border-gray-800 text-textMuted hover:border-blood hover:text-blood'}`}
        >
          На день
        </button>
        <button 
          onClick={() => setParams({ view_mode: 'by_quest', date: '', quest_id: '', start_date: '' })}
          className={`px-6 py-2 uppercase tracking-widest text-sm font-bold font-sans transition-colors ${data.view_mode === 'by_quest' ? 'bg-blood text-white' : 'bg-void border border-gray-800 text-textMuted hover:border-blood hover:text-blood'}`}
        >
          По квестам
        </button>
      </div>

      {data.view_mode === 'by_date' ? (
        <>
          <div className="flex items-center gap-6 mb-8 bg-surface border border-gray-900 p-4 w-fit">
            <button onClick={() => handleDateChange(-1)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest text-sm transition-colors">← Пред. день</button>
            <strong className="text-xl text-wonderTeal font-sans tracking-widest">{data.display_date}</strong>
            <button onClick={() => handleDateChange(1)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest text-sm transition-colors">След. день →</button>
          </div>

          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
            {data.data.map(quest => (
              <div key={quest.id} className="min-w-[200px] flex-1 bg-surface border border-gray-900 flex flex-col">
                <div className="p-4 border-b border-gray-800 text-center">
                  <h6 className="text-textPrimary font-sans uppercase tracking-widest truncate">{quest.name}</h6>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  {quest.slots.map((slot, idx) => (
                    <div key={idx} className={`p-3 border text-center relative ${slot.is_booked ? (slot.is_past ? 'bg-void border-gray-900 text-textMuted' : 'bg-blood/20 border-blood text-white shadow-glow-blood') : (slot.is_past ? 'bg-void border-gray-900 text-gray-700' : 'bg-void border-wonderTeal/30 text-wonderTeal')}`}>
                      {slot.is_booked && user?.role === 'admin' && (
                        <button 
                          onClick={() => cancelGame(slot.game_id)}
                          className="absolute top-1 right-2 text-textMuted hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <strong className="block text-lg mb-1">{slot.time}</strong>
                      <span className="block text-[10px] text-wonderYellow truncate mb-2">{slot.actors || "—"}</span>
                      {slot.is_booked && slot.game_id && (
                        <div className="border-t border-gray-800/50 pt-2 mt-2">
                          <span className="text-xs uppercase tracking-widest font-bold">Бронь #{slot.game_id}</span>
                        </div>
                      )}
                      {!slot.is_booked && !slot.is_past && (
                        <div className="border-t border-wonderTeal/20 pt-2 mt-2">
                          <span className="text-xs uppercase tracking-widest font-bold">Свободно</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.quests.map(q => (
              <button 
                key={q.id}
                onClick={() => setParams({ ...params, quest_id: q.id })}
                className={`px-4 py-2 uppercase tracking-widest text-xs font-sans transition-colors ${data.quest_id === q.id ? 'bg-wonderTeal text-void font-bold' : 'bg-void border border-gray-800 text-textMuted hover:border-wonderTeal hover:text-wonderTeal'}`}
              >
                {q.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 mb-8 bg-surface border border-gray-900 p-4 w-fit">
            <button onClick={() => handleDateChange(-7)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest text-sm transition-colors">← Неделя</button>
            <strong className="text-xl text-wonderTeal font-sans tracking-widest">с {data.display_start_date}</strong>
            <button onClick={() => handleDateChange(7)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest text-sm transition-colors">Неделя →</button>
          </div>

          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
            {data.data.map((day, dIdx) => (
              <div key={dIdx} className="min-w-[160px] flex-1 bg-surface border border-gray-900 flex flex-col">
                <div className="p-4 border-b border-gray-800 text-center">
                  <h6 className="text-textPrimary font-sans uppercase tracking-widest">{day.display_date}</h6>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  {day.slots.map((slot, idx) => (
                    <div key={idx} className={`p-3 border text-center relative ${slot.is_booked ? (slot.is_past ? 'bg-void border-gray-900 text-textMuted' : 'bg-blood/20 border-blood text-white shadow-glow-blood') : (slot.is_past ? 'bg-void border-gray-900 text-gray-700' : 'bg-void border-wonderTeal/30 text-wonderTeal')}`}>
                      {slot.is_booked && user?.role === 'admin' && (
                        <button 
                          onClick={() => cancelGame(slot.game_id)}
                          className="absolute top-1 right-2 text-textMuted hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <strong className="block text-lg mb-1">{slot.time}</strong>
                      <span className="block text-[10px] text-wonderYellow truncate mb-2">{slot.actors || "—"}</span>
                      {slot.is_booked && slot.game_id && (
                        <div className="border-t border-gray-800/50 pt-2 mt-2">
                          <span className="text-xs uppercase tracking-widest font-bold">Бронь #{slot.game_id}</span>
                        </div>
                      )}
                      {!slot.is_booked && !slot.is_past && (
                        <div className="border-t border-wonderTeal/20 pt-2 mt-2">
                          <span className="text-xs uppercase tracking-widest font-bold">Свободно</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;