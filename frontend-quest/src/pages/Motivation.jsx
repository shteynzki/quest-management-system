import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Motivation = () => {
  const { user } = useContext(AuthContext);
  const [actors, setActors] = useState([]);
  
  const [editingCell, setEditingCell] = useState(null);
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categoriesMinus = [
    { key: 'dirty', name: 'Грязно / Мусор' },
    { key: 'no_report', name: 'Не выставлен отчёт' },
    { key: 'report_error', name: 'Ошибка в отчёте' },
    { key: 'no_upsell', name: 'Нет допродажи' },
    { key: 'late_15', name: 'Опоздание (15 мин)' },
    { key: 'late_game', name: 'Задержка игры' },
    { key: 'light_on', name: 'Свет / Техника / Двери' },
    { key: 'no_consumables', name: 'Нет расходников' },
    { key: 'no_breakage_report', name: 'Не сообщили о поломке' },
    { key: 'skip_warned', name: 'Прогул с предупреждением' }
  ];

  const categoriesPlus = [
    { key: 'photo', name: 'Фото (+10 WP, +100₽)' },
    { key: 'repair', name: 'Ремонт' },
    { key: 'replacement', name: 'Выход на замену' },
    { key: 'content_solo', name: 'Контент (Соло)' },
    { key: 'content_duo', name: 'Контент (Дуо)' },
    { key: 'content_trio', name: 'Контент (Трио+)' },
    { key: 'review_aggr_solo', name: 'Отзыв Агрегатор (Соло)' },
    { key: 'review_aggr_duo', name: 'Отзыв Агрегатор (Дуо)' },
    { key: 'review_maps_solo', name: 'Отзыв Карты (Соло)' },
    { key: 'review_maps_duo', name: 'Отзыв Карты (Дуо)' },
    { key: 'return_upsell', name: 'Возврат по допродаже' },
    { key: 'initiative', name: 'Одобренная инициатива' }
  ];

  const loadData = () => {
    api.get('/actor_transactions').then(res => setActors(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (actor, cat, type) => {
    if (user?.role !== 'admin') return;
    setEditingCell({ actor, cat, type });
    setAmount('');
    setComment('');
  };

  const handleSaveTransaction = async () => {
    setIsSaving(true);
    try {
      await api.post('/actor_transactions', {
        user_id: editingCell.actor.id,
        category: editingCell.cat.key,
        transaction_type: editingCell.type,
        amount: amount || undefined,
        comment: comment
      });
      await loadData();
      setEditingCell(null);
    } catch (err) {
      alert('Ошибка при сохранении. Темные силы мешают процессу.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSum = (actor, catKey, type) => {
    return actor.transactions
      .filter(t => t.category === catKey && t.transaction_type === type)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const getPhotoBonus = (actor) => {
    const photoTransactions = actor.transactions.filter(t => t.category === 'photo' && t.transaction_type === 'plus');
    return photoTransactions.length * 100;
  };

  const getActorStats = () => {
    const stats = actors.map(a => {
      const basePoints = 60;
      const earnedPoints = a.total;
      const finalPoints = basePoints + earnedPoints;
      return { ...a, finalPoints, photoBonus: getPhotoBonus(a) };
    });

    const tier1Actors = stats.filter(a => a.finalPoints >= 150);
    const tier2Actors = stats.filter(a => a.finalPoints >= 200);
    const maxPoints = Math.max(...stats.map(a => a.finalPoints), 0);
    
    return stats.map(a => {
      let money = a.photoBonus;
      
      if (a.finalPoints < 0) {
        money += a.finalPoints * 100; 
      }

      let prizes = [];

      if (a.finalPoints >= 150) {
        const t1Share = Math.min(Math.floor(3000 / tier1Actors.length), 1000);
        money += t1Share;
        prizes.push(`Тир 1 (+${t1Share}₽)`);
      }

      if (a.finalPoints >= 200) {
        const t2Share = Math.min(Math.floor(3000 / tier2Actors.length), 2000);
        money += t2Share;
        prizes.push(`Тир 2 (+${t2Share}₽)`);
      }

      if (a.finalPoints >= 201 && a.finalPoints === maxPoints) {
        money += 4000;
        prizes.push('🏆 Победитель (+4000₽)');
      }

      return { ...a, money, prizes };
    });
  };

  if (!actors.length) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Открытие архивов...</div>;

  const analyzedActors = getActorStats();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-[1400px] mx-auto relative z-10">
      <div className="border-b border-gray-900 pb-6 mb-10 flex justify-between items-end">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Wonderpoints</h1>
        <Link to="/dashboard" className="text-wonderTeal hover:text-wonderYellow uppercase tracking-widest text-sm font-sans transition-colors">
          Вернуться в убежище
        </Link>
      </div>

      {isAdmin && (
        <div className="mb-6 p-4 bg-wonderYellow/10 border border-wonderYellow text-textPrimary font-sans text-sm tracking-widest uppercase inline-block">
          Режим управления: Нажмите на любую ячейку в таблице, чтобы начислить штраф или бонус
        </div>
      )}

      <div className="overflow-x-auto bg-surface border border-gray-900 mb-10">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-void border-b border-gray-800">
            <tr>
              <th className="p-4 text-textMuted uppercase tracking-widest font-normal sticky left-0 bg-void z-10 border-r border-gray-800">Категория</th>
              {analyzedActors.map(a => <th key={a.id} className="p-4 text-textPrimary uppercase tracking-widest font-bold whitespace-nowrap text-center">{a.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            <tr className="bg-blood/5">
              <td colSpan={analyzedActors.length + 1} className="p-4 text-blood font-bold uppercase tracking-widest sticky left-0 bg-[#0a0202] z-10">Штрафы (Минус баллы)</td>
            </tr>
            {categoriesMinus.map(cat => (
              <tr key={cat.key} className="hover:bg-void transition-colors group">
                <td className="p-4 text-textPrimary sticky left-0 bg-surface group-hover:bg-void z-10 border-r border-gray-800">{cat.name}</td>
                {analyzedActors.map(a => (
                  <td 
                    key={a.id} 
                    onClick={() => openEditModal(a, cat, 'minus')}
                    className={`p-4 text-blood text-center transition-colors ${isAdmin ? 'cursor-pointer hover:bg-blood/20' : ''}`}
                    title={isAdmin ? "Начислить штраф" : ""}
                  >
                    {getSum(a, cat.key, 'minus') || '-'}
                  </td>
                ))}
              </tr>
            ))}
            
            <tr className="bg-wonderTeal/5">
              <td colSpan={analyzedActors.length + 1} className="p-4 text-wonderTeal font-bold uppercase tracking-widest sticky left-0 bg-[#020a0a] z-10">Бонусы (Плюс баллы)</td>
            </tr>
            {categoriesPlus.map(cat => (
              <tr key={cat.key} className="hover:bg-void transition-colors group">
                <td className="p-4 text-textPrimary sticky left-0 bg-surface group-hover:bg-void z-10 border-r border-gray-800">{cat.name}</td>
                {analyzedActors.map(a => (
                  <td 
                    key={a.id} 
                    onClick={() => openEditModal(a, cat, 'plus')}
                    className={`p-4 text-wonderTeal text-center transition-colors ${isAdmin ? 'cursor-pointer hover:bg-wonderTeal/20' : ''}`}
                    title={isAdmin ? "Начислить бонус" : ""}
                  >
                    {getSum(a, cat.key, 'plus') || '-'}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="bg-void border-t-4 border-gray-800">
              <td className="p-4 font-bold uppercase tracking-widest text-textMuted sticky left-0 bg-void z-10 border-r border-gray-800">Стартовый капитал</td>
              {analyzedActors.map(a => <td key={a.id} className="p-4 text-center text-textMuted">60</td>)}
            </tr>

            <tr className="bg-void">
              <td className="p-4 font-bold uppercase tracking-widest text-wonderYellow text-lg sticky left-0 bg-void z-10 border-r border-gray-800">ИТОГО БАЛЛОВ</td>
              {analyzedActors.map(a => (
                <td key={a.id} className={`p-4 text-center font-bold text-xl ${a.finalPoints >= 150 ? 'text-wonderYellow drop-shadow-[0_0_8px_#f3c623]' : a.finalPoints < 0 ? 'text-blood drop-shadow-[0_0_8px_#8a0303]' : 'text-textPrimary'}`}>
                  {a.finalPoints} WP
                </td>
              ))}
            </tr>

            <tr className="bg-gray-900/50">
              <td className="p-4 font-bold uppercase tracking-widest text-textPrimary sticky left-0 bg-gray-900/50 z-10 border-r border-gray-800">Достижения</td>
              {analyzedActors.map(a => (
                <td key={a.id} className="p-4 text-center">
                  {a.prizes.length > 0 ? (
                    <div className="flex flex-col gap-1 items-center">
                      {a.prizes.map((p, i) => <span key={i} className="text-[10px] text-wonderTeal bg-wonderTeal/10 border border-wonderTeal/30 px-2 py-1 uppercase tracking-widest">{p}</span>)}
                    </div>
                  ) : (
                    <span className="text-gray-700 text-xs">—</span>
                  )}
                </td>
              ))}
            </tr>

            <tr className="bg-void border-t-2 border-blood">
              <td className="p-4 font-bold uppercase tracking-widest text-textPrimary sticky left-0 bg-void z-10 border-r border-gray-800">ФИНАНСОВЫЙ БОНУС</td>
              {analyzedActors.map(a => (
                <td key={a.id} className={`p-4 text-center font-bold text-lg ${a.money >= 0 ? 'text-wonderTeal' : 'text-blood'}`}>
                  {a.money > 0 ? '+' : ''}{a.money} ₽
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

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
              className={`bg-surface border w-full max-w-md p-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] ${editingCell.type === 'minus' ? 'border-blood' : 'border-wonderTeal'}`}
            >
              <button onClick={() => setEditingCell(null)} className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors">✕</button>
              
              <h3 className={`text-xl font-sans font-bold uppercase tracking-widest mb-2 ${editingCell.type === 'minus' ? 'text-blood' : 'text-wonderTeal'}`}>
                {editingCell.type === 'minus' ? 'Выписать штраф' : 'Выдать премию'}
              </h3>
              
              <div className="mb-6 border-b border-gray-800 pb-4">
                <p className="text-textPrimary font-sans text-lg mb-1">Актер: <span className="font-bold">{editingCell.actor.name}</span></p>
                <p className="text-textMuted font-sans text-sm">Действие: <span className="text-wonderYellow">{editingCell.cat.name}</span></p>
                <p className="text-textMuted font-sans text-sm mt-2">
                  Текущая сумма баллов по этой категории: <strong className="text-textPrimary">{getSum(editingCell.actor, editingCell.cat.key, editingCell.type) || 0}</strong>
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Баллы (Оставьте пустым для тарифа по умолчанию)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Например: 15"
                    className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-3 font-sans outline-none focus:border-wonderYellow transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Комментарий (необязательно)</label>
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Причина..."
                    className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-3 font-sans outline-none focus:border-wonderYellow transition-colors" 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingCell(null)}
                  className="flex-1 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white font-sans uppercase tracking-widest text-xs font-bold transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={handleSaveTransaction}
                  disabled={isSaving}
                  className={`flex-1 py-3 text-white font-sans uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-50 ${editingCell.type === 'minus' ? 'bg-blood hover:bg-darkblood' : 'bg-wonderTeal text-void hover:bg-white'}`}
                >
                  {isSaving ? 'Сохранение...' : 'Записать в архив'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Motivation;