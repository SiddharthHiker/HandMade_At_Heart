import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Set axios defaults
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = auth?.token || '';
  }, [auth?.token]);

  // Initialize from localStorage
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        setAuth(JSON.parse(data));
      } catch (err) {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };