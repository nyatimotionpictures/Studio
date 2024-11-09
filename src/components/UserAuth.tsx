import { useAuth } from '../context/AuthProvider';

function UserAuth() {
  const { user, login, logout, loading } = useAuth();
  const isLoggedIn = !!user?.id;

  return (
    <div className="flex items-center justify-between w-full max-w-xl">
      <button
        disabled={loading}
        className="bg-teal-500 text-white px-4 py-2 rounded-md"
        onClick={isLoggedIn ? logout : login}>
        {isLoggedIn && !loading ? 'Logout' : 'Login'}
        {loading && '... 🏃'}
      </button>
    </div>
  );
}

export default UserAuth;
