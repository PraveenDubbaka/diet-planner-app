import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminLoginPage from './pages/AdminLoginPage';
import Admin from './pages/Admin';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/admin',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/dashboard',
    element: <Admin />,
  },
];

export default routes;