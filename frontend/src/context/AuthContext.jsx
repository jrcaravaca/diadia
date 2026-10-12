import { createContext, useState, useEffect } from "react";
import apiClient from '../api/client'; 

export const AuthContext = createContext(); 

export function AuthProvider({children}) {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    // Comprobar si hay un usuario y token en localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token'); 

        // Configurar token por defecto en AXIOS para todas las peticiones
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        setLoading(false);
    }, []); 

    // Función inicio de sesión
    const login = async (username, password) => {
        const response = await apiClient.post('token/', { username, password }); 
        const { access, user: userData } = response.data;

        // Guardar en localStorage
        localStorage.setItem('token', access); 
        localStorage.setItem('user', JSON.stringify(userData)); 

        // Asignar el token a las cabeceras HTTP de AXIOS
        apiClient.defaults.headers.common['Authorization' ] = `Bearer ${access}`; 

        // Actualizar estado global
        setUser(userData); 

        return userData; 
    }; 

    // Función cierre de sesión
    const logout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user'); 
        delete apiClient.defaults.headers.common['Authorization']; 
        setUser(null); 
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );

}
