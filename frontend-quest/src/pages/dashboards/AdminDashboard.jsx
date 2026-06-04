import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard_data').then(res => setData(res.data));
  }, []);

  if (!data) return <div className="min-h-screen pt-28 text-center text-wonderTeal font-horror text-2xl animate-pulse">Сбор душ...</div>;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#d1d5db',
          font: { family: 'sans-serif', size: 12, letterSpacing: '0.1em' }
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#1f2937' },
        ticks: { color: '#9ca3af', font: { family: 'sans-serif' } }
      },
      x: {
        grid: { color: '#1f2937' },
        ticks: { color: '#9ca3af', font: { family: 'sans-serif' } }
      }
    }
  };

  const revenueData = {
    labels: data.revenue_by_day ? Object.keys(data.revenue_by_day) : [],
    datasets: [
      {
        label: 'Выручка (₽)',
        data: data.revenue_by_day ? Object.values(data.revenue_by_day) : [],
        borderColor: '#8a0303',
        backgroundColor: 'rgba(138, 3, 3, 0.5)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#008080',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const questsData = {
    labels: data.games_by_quest ? Object.keys(data.games_by_quest) : [],
    datasets: [
      {
        label: 'Проведено игр',
        data: data.games_by_quest ? Object.values(data.games_by_quest) : [],
        backgroundColor: '#008080',
        borderColor: '#005959',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div className="border-b border-gray-900 pb-6 mb-10">
        <h1 className="text-4xl font-horror text-blood tracking-widest">Панель управления</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Link to="/schedule" className="bg-surface border border-gray-800 p-4 text-center hover:border-blood transition-all uppercase tracking-widest text-sm text-textPrimary hover:text-blood block">Расписание</Link>
        <Link to="/motivation" className="bg-surface border border-gray-800 p-4 text-center hover:border-wonderYellow transition-all uppercase tracking-widest text-sm text-textPrimary hover:text-wonderYellow block">Таблица мотивации</Link>
        <Link to="/staff" className="bg-surface border border-gray-800 p-4 text-center hover:border-wonderTeal transition-all uppercase tracking-widest text-sm text-textPrimary hover:text-wonderTeal block">Управление актерами</Link>
        <a href="http://localhost:3000/api/staff/monthly_report.pdf" target="_blank" rel="noreferrer" className="bg-blood/10 border border-blood p-4 text-center hover:bg-blood hover:text-white transition-all uppercase tracking-widest text-sm text-blood block">Отчет за месяц</a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface border border-gray-800 p-6">
          <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Динамика выручки (7 дней)</h3>
          <div className="h-72">
            {data.revenue_by_day && Object.keys(data.revenue_by_day).length > 0 ? (
              <Line data={revenueData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-textMuted font-sans text-sm uppercase tracking-widest">Нет данных за период</div>
            )}
          </div>
        </div>

        <div className="bg-surface border border-gray-800 p-6">
          <h3 className="text-xl font-sans font-bold text-textPrimary uppercase tracking-widest mb-6">Популярность квестов</h3>
          <div className="h-72">
            {data.games_by_quest && Object.keys(data.games_by_quest).length > 0 ? (
              <Bar data={questsData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-textMuted font-sans text-sm uppercase tracking-widest">Нет проведенных игр</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;