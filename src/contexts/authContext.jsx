import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUsuario(parsedUser);
            } catch (e) {
                console.error("Error al parsear usuario de localStorage", e);
                localStorage.removeItem('usuario');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData) => {
        setUsuario(userData);
        localStorage.setItem('usuario', JSON.stringify(userData));
        console.log("Usuario logueado y guardado:", userData);
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
    };

    const updateCurrentUserProfile = async (newProfileData) => {
        if (usuario) {
            const updatedUser = {
                ...usuario,
                ...newProfileData
            };
            setUsuario(updatedUser);
            localStorage.setItem('usuario', JSON.stringify(updatedUser));
            console.log("Usuario actualizado en contexto y localStorage:", updatedUser);
        } else {
            console.warn("No hay usuario logueado para actualizar el perfil.");
        }
    };

    return (
        <AuthContext.Provider value={{
            usuario,
            login,
            logout,
            isLoading,
            updateCurrentUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};