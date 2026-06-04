import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const PlayerDashboard = () => {
  const [data, setData] = useState(null);
  const [reviewForm, setReviewForm] = useState({ gameId: null, score: 5, text: '' });

  const loadData = () => {
    api.get('/dashboard_data').then(res => setData(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitReview = async (gameId) => {
    try {
      await api.post(`/games/${gameId}/reviews`, {
        score: reviewForm.score,
        text: reviewForm.text
      });
      setReviewForm({ gameId: null, score: 5, text: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelGame = async (gameId) => {
    if (window.confirm('Вы уверены, что хотите отказаться от игры? Демоны будут скучать...')) {
      try {
        await api.delete(`/games/${gameId}`);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!data) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Чтение мыслей...</div>;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="border-b border-gray-900 pb-6 mb-10">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Убежище игрока</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-gray-800 p-6 rounded-sm">
          <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Мои игры</h3>
          {!data.my_games || data.my_games.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-800">
              <p className="text-textMuted mb-4">Жертва еще не выбрала свой путь.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.my_games.map(game => (
                <div key={game.id} className="p-4 border border-gray-800 bg-void flex flex-col group hover:border-blood transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-textPrimary text-lg group-hover:text-blood transition-colors">{game.quest_name}</div>
                      <div className="text-wonderTeal text-sm">{game.time}</div>
                    </div>
                    
                    {!game.is_past && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs uppercase tracking-widest text-wonderYellow border border-wonderYellow px-2 py-1">Предстоит</span>
                        <button 
                          onClick={() => cancelGame(game.id)} 
                          className="text-[10px] uppercase tracking-widest text-textMuted hover:text-blood transition-colors"
                        >
                          Отменить бронь
                        </button>
                      </div>
                    )}
                    
                    {game.is_past && game.has_review && (
                      <span className="text-xs uppercase tracking-widest text-gray-500 border border-gray-800 px-2 py-1">Оценено</span>
                    )}
                    
                    {game.is_past && !game.has_review && reviewForm.gameId !== game.id && (
                      <button 
                        onClick={() => setReviewForm({ gameId: game.id, score: 5, text: '' })}
                        className="text-xs uppercase tracking-widest text-blood border border-blood px-2 py-1 hover:bg-blood hover:text-white transition-colors h-fit"
                      >
                        Оценить
                      </button>
                    )}
                  </div>

                  {reviewForm.gameId === game.id && (
                    <div className="mt-4 pt-4 border-t border-gray-900 flex flex-col gap-3">
                      <select 
                        value={reviewForm.score} 
                        onChange={(e) => setReviewForm({...reviewForm, score: e.target.value})}
                        className="bg-surface border border-gray-800 text-textPrimary p-2 outline-none focus:border-blood"
                      >
                        <option value="5">5 - Шедевр ужаса</option>
                        <option value="4">4 - Было страшно</option>
                        <option value="3">3 - Неплохо</option>
                        <option value="2">2 - Скучно</option>
                        <option value="1">1 - Разочарование</option>
                      </select>
                      <textarea 
                        value={reviewForm.text}
                        onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                        placeholder="Поделитесь страхами..."
                        className="bg-surface border border-gray-800 text-textPrimary p-2 outline-none focus:border-blood resize-none"
                        rows="2"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setReviewForm({ gameId: null, score: 5, text: '' })} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest px-3 py-1">Отмена</button>
                        <button onClick={() => submitReview(game.id)} className="bg-blood text-white text-xs uppercase tracking-widest px-4 py-1">Отправить</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-gray-800 p-6 rounded-sm h-fit">
          <h3 className="text-xl font-sans font-bold text-wonderYellow uppercase tracking-widest mb-6">Рекомендуем вам</h3>
          {!data.recommended || data.recommended.length === 0 ? (
            <div className="text-center py-10 text-textMuted">Пройдите хотя бы один квест, чтобы мы узнали ваши страхи.</div>
          ) : (
            <div className="space-y-4">
              {data.recommended.map(quest => (
                <div key={quest.id} className="p-4 border border-gray-800 bg-void group hover:border-wonderYellow transition-colors">
                  <div className="text-textPrimary text-lg mb-2">{quest.name}</div>
                  <div className="text-textMuted text-sm mb-4 line-clamp-2">{quest.info}</div>
                  <Link to={`/quests/${quest.id}`} className="text-xs uppercase tracking-widest text-wonderYellow border border-wonderYellow px-3 py-1 hover:bg-wonderYellow hover:text-void transition-colors">
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;