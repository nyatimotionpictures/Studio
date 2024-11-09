import { useState } from 'react';
import { invoke } from './lib/axios';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <div className=" flex flex-col gap-5 items-center h-full">
      <h2 className="text-blue-200 text-5xl">Hi there 🦹‍♀️ </h2>
      <p className="text-3xl">
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Users />
      </ErrorBoundary>
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div
      role="alert"
      className="w-full max-w-xl mx-auto bg-red-100 text-red-600 rounded-md p-4 text-center">
      <h3 className="text-xl font-bold">Something went wrong:</h3>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<Error | null>(null);
  const handleUsersFetch = async () => {
    const response = await invoke({ method: 'GET', endpoint: '/user/findall' });
    if (response?.error) {
      setError(response.error);
      return;
    }
    setUsers(response?.res?.users);
  };

  if (error) {
    throw error;
  }
  return (
    <div>
      <button onClick={handleUsersFetch}>Fetch Users</button>
      <div>
        {users?.map(
          (user: { id: string; firstname: string; email: string }) => (
            <div key={user.id}>
              {user?.firstname} &bull; {user?.email}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default App;
