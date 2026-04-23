import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  googleLogin: async () => {},
  pendingAction: null,
  setPendingAction: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travelsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingAction, setPendingAction] = useState(null);

  // Simple mock database using localStorage
  const getDb = () => {
    const db = localStorage.getItem('travelsphere_db');
    return db ? JSON.parse(db) : { users: {} };
  };

  const saveDb = (db) => {
    localStorage.setItem('travelsphere_db', JSON.stringify(db));
  };

  const login = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        const isAdmin = email === 'admin123@gmail.com' && password === 'admin@1234';
        
        if (isAdmin) {
          const u = { name: 'Admin', email, isAdmin: true };
          setUser(u);
          localStorage.setItem('travelsphere_user', JSON.stringify(u));
          resolve();
        } else {
          // For any other credentials, treat as a user login.
          // If the user doesn't exist in our mock DB, we'll just create a mock name from the email.
          const userRec = db.users[email];
          const name = userRec ? userRec.name : email.split('@')[0];
          const u = { name, email, isAdmin: false };
          setUser(u);
          localStorage.setItem('travelsphere_user', JSON.stringify(u));
          resolve();
        }
      }, 600);
    });
  };

  const register = async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        
        if (db.users[email]) {
          reject(new Error('User with this email already exists'));
        } else {
          db.users[email] = { name, password };
          saveDb(db);
          
          const u = { name, email, isAdmin: false };
          setUser(u);
          localStorage.setItem('travelsphere_user', JSON.stringify(u));
          resolve();
        }
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelsphere_user');
  };

  const googleLogin = async (name, email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const u = { name, email, isAdmin: false };
        setUser(u);
        localStorage.setItem('travelsphere_user', JSON.stringify(u));
        resolve();
      }, 800);
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, googleLogin, pendingAction, setPendingAction }}>
      {children}
    </AuthContext.Provider>
  );
}
