import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const stored = sessionStorage.getItem("usuario");
    if (stored) {
      try {
        setUsuario(JSON.parse(stored));     
      } catch (err) {
        console.error("Usuario corrupto en storage:", err);
        sessionStorage.removeItem("usuario"); 
      }
    }
    setCargando(false);
  }, []);


  const login = (user) => {
    setUsuario(user);
    sessionStorage.setItem("usuario", JSON.stringify(user));
  };


  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem("usuario");
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


