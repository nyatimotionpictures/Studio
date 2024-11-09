import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto space-y-4">
        <AdminAuthNav />
        <hr className="border border-gray-600 max-w-xl mx-auto" />
        <Outlet />
      </div>
    </div>
  );
}

function AdminAuthNav() {
  const { user, fetching } = useAuth();
  const isLoggedIn = !!user?.id;
  const navigate = useNavigate();
  console.log('USER', user);
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <Undo2 className="w-6 h-6" />
        </button>
        {fetching ? (
          <h1 className="text-lg">Fetching admin profile...</h1>
        ) : (
          <h1 className="text-xl font-bold">
            {isLoggedIn ? `Welcome back, ${user?.firstname}` : 'Please login'}
          </h1>
        )}
      </div>
    </div>
  );
}

export default AdminLayout;
