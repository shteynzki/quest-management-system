import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../api';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quest, setQuest] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);
  const [timetable, setTimetable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState(4);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    api.get(`/quests/${id}`).then(res => setQuest(res.data));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dateOffset);
    const dateString = targetDate.toISOString().split('T')[0];

    api.get(`/quests/${id}/timetable?date=${dateString}`)
      .then(res => {
        setTimetable(res.data);
        setLoading(false);
        setSelectedSlot(null);
      });
  }, [id, dateOffset]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    
    const extraPlayers = Math.max(0, players - 4);
    const extraCost = extraPlayers * 1000;
    const discount = isBirthday ? 500 : 0;
    const finalPrice = Math.max(0, selectedSlot.price + extraCost - discount);

    const combinedInfo = `Игроков: ${players}. День рождения: ${isBirthday ? 'Да' : 'Нет'}. Ожидаемая сумма: ${finalPrice} ₽. Комментарий: ${info}`;

    try {
      await api.post(`/quests/${id}/order`, { time: selectedSlot.full_time, info: combinedInfo });
      navigate('/dashboard');
    } catch (err) {
      alert('Ошибка бронирования. Возможно, время уже занято.');
    }
  };

  const calculateCurrentPrice = () => {
    if (!selectedSlot) return 0;
    const extraPlayers = Math.max(0, players - 4);
    const extraCost = extraPlayers * 1000;
    const discount = isBirthday ? 500 : 0;
    return Math.max(0, selectedSlot.price + extraCost - discount);
  };

  if (!quest) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Установка связи...</div>;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-5xl mx-auto relative z-10">
      <div className="border-b border-gray-900 pb-6 mb-10">
        <h1 className="text-4xl font-horror text-blood tracking-widest mb-2">Бронирование</h1>
        <h2 className="text-2xl text-wonderTeal font-sans uppercase tracking-widest">{quest.name}</h2>
      </div>

      <div className="bg-surface border border-gray-800 p-6 mb-8 flex items-center justify-between">
        <button onClick={() => setDateOffset(prev => prev - 1)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest font-bold font-sans text-sm transition-colors">← Пред. день</button>
        <span className="text-xl font-bold font-sans tracking-widest text-textPrimary">{timetable?.display_date}</span>
        <button onClick={() => setDateOffset(prev => prev + 1)} className="text-textMuted hover:text-wonderTeal uppercase tracking-widest font-bold font-sans text-sm transition-colors">След. день →</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {loading ? (
          <div className="col-span-full text-center text-textMuted animate-pulse py-10">Загрузка слотов...</div>
        ) : (
          timetable?.slots.map((slot, idx) => {
            const isUnavailable = slot.is_booked || slot.is_past;
            const isSelected = selectedSlot?.full_time === slot.full_time;
            return (
              <button
                key={idx}
                disabled={isUnavailable}
                onClick={() => setSelectedSlot(slot)}
                className={`p-4 border transition-all text-center flex flex-col items-center justify-center gap-1 font-sans ${
                  isUnavailable 
                    ? 'bg-void border-gray-900 text-gray-700 cursor-not-allowed' 
                    : isSelected 
                      ? 'bg-blood/20 border-blood text-white shadow-glow-blood' 
                      : 'bg-surface border-gray-700 text-textPrimary hover:border-wonderTeal'
                }`}
              >
                <span className="text-xl font-bold">{slot.time}</span>
                {!isUnavailable && <span className="text-wonderYellow text-xs tracking-widest">от {slot.price} ₽</span>}
                {slot.is_booked && <span className="text-blood text-xs tracking-widest uppercase mt-1">Занято</span>}
                {slot.is_past && !slot.is_booked && <span className="text-gray-600 text-xs tracking-widest uppercase mt-1">Прошло</span>}
              </button>
            );
          })
        )}
      </div>

      {selectedSlot && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-blood p-6">
          <div className="flex flex-col md:flex-row gap-8 mb-6 border-b border-gray-800 pb-6">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-3">
                  Количество жертв: <span className="text-wonderTeal text-lg">{players}</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="8" 
                  value={players} 
                  onChange={(e) => setPlayers(parseInt(e.target.value))}
                  className="w-full accent-blood"
                />
                <div className="flex justify-between text-gray-600 text-xs mt-1">
                  <span>2</span>
                  <span>4 (база)</span>
                  <span>8</span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isBirthday} 
                  onChange={(e) => setIsBirthday(e.target.checked)}
                  className="w-5 h-5 accent-blood bg-void border-gray-800"
                />
                <span className="text-textPrimary font-sans uppercase tracking-widest text-sm">
                  День рождения (-500 ₽)
                </span>
              </label>

              <div>
                <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Комментарий</label>
                <textarea
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="Пожелания, комментарии или страхи..."
                  className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-3 font-sans outline-none focus:border-blood resize-none"
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-void border border-gray-800 p-6 flex flex-col justify-center items-center text-center">
              <span className="text-textMuted font-sans uppercase tracking-widest text-xs mb-2">Итоговая стоимость</span>
              <span className="text-5xl font-bold font-sans text-wonderYellow mb-2">{calculateCurrentPrice()} ₽</span>
              <span className="text-gray-500 font-sans text-xs">
                {players > 4 ? `Включает доплату за ${players - 4} доп. игроков` : 'Базовая стоимость (до 4 игроков)'}
              </span>
            </div>
          </div>

          {user ? (
            <button onClick={handleBook} className="w-full py-4 bg-blood text-white font-sans font-bold uppercase tracking-[0.2em] transition-all hover:bg-darkblood hover:shadow-[0_0_15px_#8a0303]">
              Подтвердить бронирование
            </button>
          ) : (
            <div className="text-center bg-void p-4 border border-gray-800">
              <span className="text-textMuted font-sans tracking-wide">Чтобы забронировать время, необходимо </span>
              <Link to="/login" className="text-wonderTeal hover:text-wonderYellow transition-colors font-sans uppercase tracking-widest font-bold ml-1">войти в систему</Link>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Booking;