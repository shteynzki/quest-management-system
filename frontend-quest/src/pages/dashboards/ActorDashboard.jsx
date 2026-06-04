import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const ActorDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard_data').then(res => setData(res.data));
  }, []);

  if (!data) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Чтение мыслей...</div>;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="border-b border-gray-900 pb-6 mb-10">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Задачи Актера</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-gray-800 p-6 rounded-sm">
          <h3 className="text-xl font-sans font-bold text-wonderYellow uppercase tracking-widest mb-6">Мои смены и отчеты</h3>
          
          {!data.upcoming_shifts || data.upcoming_shifts.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-800">
              <p className="text-textMuted font-sans">Смен пока нет. Тьма спит.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcoming_shifts.map(shift => (
                <div key={shift.id} className="p-4 border border-gray-800 bg-void">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-textPrimary text-lg">{shift.quest_name}</strong>
                    <span className="text-wonderTeal text-sm bg-surface px-2 py-1 border border-gray-800">{shift.time}</span>
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-900">
                    {shift.is_past ? (
                      shift.has_report ? (
                        <Link to={`/reports/${shift.id}`} className="text-wonderTeal hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
                          Смотреть отчет
                        </Link>
                      ) : (
                        <Link to={`/reports/new/${shift.id}`} className="text-blood border border-blood px-4 py-1 hover:bg-blood hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
                          Заполнить отчет
                        </Link>
                      )
                    ) : (
                      <span className="text-wonderYellow text-sm uppercase tracking-widest">Предстоит</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-gray-800 p-6 rounded-sm h-fit">
          <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Быстрые действия</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/motivation" className="block w-full p-4 bg-void border border-gray-800 text-center hover:border-wonderYellow transition-colors group">
              <span className="block text-textPrimary font-sans uppercase tracking-widest text-sm group-hover:text-wonderYellow transition-colors">Таблица мотивации</span>
            </Link>
            <Link to="/schedule" className="block w-full p-4 bg-void border border-gray-800 text-center hover:border-wonderTeal transition-colors group">
              <span className="block text-textPrimary font-sans uppercase tracking-widest text-sm group-hover:text-wonderTeal transition-colors">Общее расписание</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDashboard;