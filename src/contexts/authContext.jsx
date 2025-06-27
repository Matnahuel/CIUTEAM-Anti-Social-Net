import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        setUsuario(JSON.parse(stored));     
      } catch (err) {
        console.error("Usuario corrupto en storage:", err);
        localStorage.removeItem("usuario"); 
      }
    }
    setCargando(false);
  }, []);


  const login = (user) => {
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
  };


  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


