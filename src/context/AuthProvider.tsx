import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Cookies from 'js-cookie';
import { invoke } from '../lib/axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ADMIN } from '../lib/types';

type Payload = {
  id: string;
} & JwtPayload;

type AuthContextType = {
  user: ADMIN | null;
  loading: boolean;
  fetching: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<ADMIN | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const authToken = Cookies.get('_auth_token');

  const credentials = {
    email: 'admin@mail.com',
    password: 'secr3tP@ss',
  };

  const endpoint = '/admin/auth';

  const login = async () => {
    setLoading(true);

    // if auth token exists, fetch the admin profile check expiration
    if (authToken) {
      const payload = jwtDecode<Payload>(authToken);
      if (payload?.exp && Date.now() >= payload?.exp * 1000) {
        await logout();
        setLoading(false);
        // redirect to login page
        return;
      }
    }

    const response = await invoke<{
      token: string;
      user: ADMIN;
    }>({
      method: 'POST',
      endpoint: `${endpoint}/login`,
      data: credentials,
    });
    if (response?.error) {
      setLoading(false);
      throw new Error(response.error);
    }
    Cookies.set('_auth_token', response?.res?.token ?? '', {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });
    setAdmin(response?.res?.user ?? null);
    setLoading(false);
  };

  const logout = async () => {
    try {
      setLoading(true);
      const id = admin?.id;
      if (!id) throw new Error('No user id found');
      const response = await invoke({
        method: 'POST',
        endpoint: `${endpoint}/logout/${id}`,
      });
      if (response?.error) {
        throw new Error(response?.error);
      }

      Cookies.remove('_auth_token');
      setAdmin(null);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = useCallback(async () => {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    // if admin is already set, no need to fetch again
    if (admin?.email) return;

    setFetching(true);
    const payload = jwtDecode<Payload>(authToken);
    const response = await invoke<{ admin: ADMIN }>({
      method: 'GET',
      endpoint: `${endpoint}/me/${payload?.id}`,
    });

    if (response?.error) {
      setFetching(false);
      throw new Error(response.error);
    }

    setAdmin(response?.res?.admin ?? null);

    setFetching(false);
  }, [authToken, endpoint, admin?.email]);

  const isAuthenticated = authToken && admin?.id ? true : false;

  useEffect(() => {
    if (!authToken) return;
    fetchUserProfile();
  }, [authToken, fetchUserProfile]);
  return (
    <AuthContext.Provider
      value={{
        user: admin,
        loading,
        fetching,
        login,
        logout,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line
export const useAuth = () => {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
