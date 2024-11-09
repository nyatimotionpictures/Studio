import { Routes, Route, NavLink, Link } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import Admin from '../pages/admin/Admin';
import App from '../App';
import NewFilm from '../pages/admin/NewFilm';
import Film from '../pages/admin/Film';
import UserAuth from '../components/UserAuth';

function AppRouter() {
  const links = [
    {
      label: 'Home',
      to: '/',
    },
    {
      label: 'Admin',
      to: '/admin',
    },
  ];
  return (
    <div className="h-auto min-h-screen bg-slate-800 text-orange-50 p-4 space-y-4 pb-20">
      <div className="p-4 max-w-xl flex items-center justify-between bg-teal-600 text-orange-50 mx-auto rounded">
        <Link to="/">Nyati</Link>
        <div className="flex gap-3 items-center">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {({ isActive }) => (
                <span className={isActive ? 'underline font-bold' : ''}>
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
          <UserAuth />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />} />
          <Route path="new-film" element={<NewFilm />} />
          <Route path="film/:film" element={<Film />} />
        </Route>
        <Route
          path="*"
          element={
            <div className=" w-screen bg-slate-800 text-orange-50 p-4 space-y-4 max-w-xl mx-auto flex flex-col items-center justify-center">
              <h1 className="text-red-200 text-[5rem] text-center">404!!</h1>
              <p className="text-3xl text-center">
                The page you are looking for does not exist.
              </p>
              <Link
                to="/"
                className="bg-teal-600 text-orange-50 p-2 rounded-md">
                Go back to home
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default AppRouter;
