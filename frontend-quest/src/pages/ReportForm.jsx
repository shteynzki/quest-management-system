import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const ReportForm = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameInfo, setGameInfo] = useState(null);
  const [actors, setActors] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    source_type: '',
    source_name: '',
    actual_actor_id: '',
    payment_method: '',
    players_count: '',
    discount_type: '',
    discount_custom: '',
    photo_sold: false,
    photo_payment: '',
    extra_expenses: 0,
    comment: '',
    calculated_amount: 0,
    actual_amount: 0,
    amount_mismatch_reason: ''
  });

  const [showMismatch, setShowMismatch] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get(`/games/${gameId}`)
      .then(res => {
        setGameInfo(res.data.game);
        setBasePrice(res.data.base_price);
        setActors(res.data.actors);
      });
  }, [gameId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzePhoto = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setOcrSuccess('');
    
    const data = new FormData();
    data.append('blank_photo', file);

    try {
      const res = await api.post(`/games/${gameId}/report/analyze_photo`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { actual_amount, discount_custom, players_count } = res.data;
      
      setFormData(prev => ({
        ...prev,
        actual_amount: actual_amount || prev.actual_amount,
        players_count: players_count || prev.players_count,
        discount_type: discount_custom ? 'other' : prev.discount_type,
        discount_custom: discount_custom || prev.discount_custom
      }));

      setOcrSuccess(`Распознано: Игроков - ${players_count || '?'}, Сумма - ${actual_amount || '?'}₽`);
    } catch (err) {
      setOcrSuccess('Не удалось распознать текст. Введите вручную.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTotal = () => {
    const players = parseInt(formData.players_count) || 0;
    let discount = 0;
    
    if (formData.discount_type === 'other') {
      discount = parseInt(formData.discount_custom) || 0;
    } else {
      discount = parseInt(formData.discount_type) || 0;
    }

    let extraPlayersCost = 0;
    if (players > 4) extraPlayersCost = (players - 4) * 1000;

    let total = basePrice - discount + extraPlayersCost;
    if (total < 0) total = 0;

    setFormData(prev => ({
      ...prev,
      calculated_amount: total,
      actual_amount: total
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/games/${gameId}/report`, { report: formData });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (!gameInfo) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Ищем документы...</div>;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-5xl mx-auto relative z-10">
      <h1 className="text-4xl font-horror text-blood tracking-widest mb-8 border-b border-gray-900 pb-4">Заполнение отчета</h1>

      <div className="bg-surface border border-wonderTeal/30 p-6 rounded-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-wonderTeal/10 rounded-full blur-[50px] pointer-events-none"></div>
        <h3 className="text-xl font-sans font-bold text-wonderTeal uppercase tracking-widest mb-4">🤖 Глаз ИИ (OCR)</h3>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Фото бланка</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:outline-none focus:border-wonderTeal transition-all file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-wonderTeal file:text-void hover:file:bg-wonderYellow transition-colors"
            />
          </div>
          <button 
            type="button"
            onClick={analyzePhoto}
            disabled={isAnalyzing || !file}
            className="px-6 py-2 border border-wonderTeal text-wonderTeal hover:bg-wonderTeal hover:text-void uppercase tracking-widest font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isAnalyzing ? 'Сканирую тьму...' : 'Распознать'}
          </button>
        </div>
        {ocrSuccess && <div className="mt-4 text-sm font-sans tracking-wide text-wonderYellow">{ocrSuccess}</div>}
      </div>

      <div className="bg-void border border-gray-800 p-4 mb-8 flex justify-between items-center text-sm font-sans tracking-widest text-textPrimary uppercase">
        <span>Квест: <span className="text-wonderTeal">{gameInfo.quest_name}</span></span>
        <span>Время: <span className="text-wonderTeal">{gameInfo.time}</span></span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5 bg-surface border border-gray-900 p-6">
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Откуда игра</label>
              <select name="source_type" value={formData.source_type} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                <option value="">Выберите...</option>
                <option value="mk">Мир Квестов</option>
                <option value="bk">Бронь компании</option>
              </select>
            </div>
            
            {formData.source_type === 'mk' && (
              <div>
                <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Площадка МК</label>
                <select name="source_name" value={formData.source_name} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                  <option value="">Выберите...</option>
                  <option value="Мир Квестов">Мир Квестов</option>
                  <option value="Топ Квестов">Топ Квестов</option>
                  <option value="Яндекс Афиша">Яндекс Афиша</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Кто проводил (Актер)</label>
              <select name="actual_actor_id" value={formData.actual_actor_id} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                <option value="">Сам за себя</option>
                {actors.map(a => (
                  <option key={a.id} value={a.id}>{a.name} {a.last_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-5 bg-surface border border-gray-900 p-6">
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Способ оплаты</label>
              <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                <option value="">Выберите...</option>
                <option value="Терминал">Терминал</option>
                <option value="Наличные">Наличные</option>
                <option value="Перевод">Перевод</option>
              </select>
            </div>

            <div>
              <label className="block text-wonderTeal font-sans text-xs uppercase tracking-widest mb-2 font-bold">Количество жертв (человек)</label>
              <input type="number" name="players_count" value={formData.players_count} onChange={handleInputChange} min="1" className="w-full bg-void border border-wonderTeal/50 text-textPrimary px-4 py-2 font-sans focus:border-wonderTeal outline-none" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Скидка</label>
                <select name="discount_type" value={formData.discount_type} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                  <option value="0">Нет</option>
                  <option value="500">500 руб</option>
                  <option value="1000">1000 руб</option>
                  <option value="other">Другая</option>
                </select>
              </div>
              {formData.discount_type === 'other' && (
                <div className="flex-1">
                  <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Сумма скидки</label>
                  <input type="number" name="discount_custom" value={formData.discount_custom} onChange={handleInputChange} className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans outline-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="photo_sold" id="photo_sold" checked={formData.photo_sold} onChange={handleInputChange} className="w-5 h-5 accent-blood bg-void border-gray-800" />
            <label htmlFor="photo_sold" className="text-textPrimary font-sans uppercase tracking-widest text-sm cursor-pointer">Фото продано?</label>
          </div>

          {formData.photo_sold && (
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Оплата за фото</label>
              <select name="photo_payment" value={formData.photo_payment} onChange={handleInputChange} className="w-full max-w-xs bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none">
                <option value="">Выберите...</option>
                <option value="Терминал">Терминал</option>
                <option value="Наличные">Наличные</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Доп. расходы (руб)</label>
              <input type="number" name="extra_expenses" value={formData.extra_expenses} onChange={handleInputChange} min="0" className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none" />
            </div>
            <div>
              <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Комментарий</label>
              <textarea name="comment" value={formData.comment} onChange={handleInputChange} rows="2" className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        <div className="bg-void border border-blood p-6">
          <button type="button" onClick={() => { calculateTotal(); setShowMismatch(true); }} className="w-full py-3 mb-6 bg-blood/20 border border-blood text-blood font-sans font-bold uppercase tracking-widest hover:bg-blood hover:text-white transition-colors">
            Рассчитать итоговую сумму
          </button>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-sans uppercase tracking-widest text-sm text-textMuted">Система насчитала:</span>
            <span className="text-4xl font-bold font-sans text-wonderYellow">{formData.calculated_amount} ₽</span>
          </div>

          {showMismatch && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 border-t border-gray-900">
              <p className="text-textPrimary font-sans uppercase tracking-widest text-sm mb-4 text-center">Сумма совпадает с реальной (на кассе)?</p>
              <div className="flex gap-4 mb-6">
                <button type="button" onClick={() => setShowSubmit(true)} className="flex-1 py-2 bg-void border border-wonderTeal text-wonderTeal hover:bg-wonderTeal hover:text-void font-sans uppercase tracking-widest text-xs font-bold transition-colors">
                  Да, всё верно
                </button>
                <button type="button" onClick={() => { setShowMismatch('edit'); setShowSubmit(true); }} className="flex-1 py-2 bg-void border border-gray-600 text-gray-400 hover:border-blood hover:text-blood font-sans uppercase tracking-widest text-xs font-bold transition-colors">
                  Нет, изменить
                </button>
              </div>

              {showMismatch === 'edit' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border border-blood bg-blood/5 space-y-4 mb-6">
                  <div>
                    <label className="block text-blood font-sans text-xs uppercase tracking-widest mb-2 font-bold">Фактическая сумма (сколько взяли)</label>
                    <input type="number" name="actual_amount" value={formData.actual_amount} onChange={handleInputChange} className="w-full bg-void border border-blood text-blood font-bold px-4 py-2 font-sans outline-none" />
                  </div>
                  <div>
                    <label className="block text-textMuted font-sans text-xs uppercase tracking-widest mb-2">Причина расхождения</label>
                    <input type="text" name="amount_mismatch_reason" value={formData.amount_mismatch_reason} onChange={handleInputChange} placeholder="Например: доплата за опоздание" className="w-full bg-void border border-gray-800 text-textPrimary px-4 py-2 font-sans focus:border-blood outline-none" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {showSubmit && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} type="submit" className="w-full py-4 bg-blood text-white font-sans font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_20px_#8a0303] text-lg">
              Отправить отчет в бездну
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReportForm;