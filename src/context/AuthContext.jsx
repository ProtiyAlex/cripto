import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('http://78.27.202.149:8000/users/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error loading user', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://78.27.202.149:8000/token', {
        username,
        password,
        grant_type: 'password',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // const userResponse = await axios.get('http://localhost:8000/users/me');
      const userResponse = await axios.get('http://78.27.202.149:8000/users/me');
      setUser(userResponse.data);
      
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://78.27.202.149:8000/register', {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error('Registration error', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);