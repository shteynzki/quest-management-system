import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PlayerDashboard from './dashboards/PlayerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ActorDashboard from './dashboards/ActorDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'actor') return <ActorDashboard />;
  return <PlayerDashboard />;
};

export default Dashboard;