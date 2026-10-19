import { useContext } from "react";
import { Navigate, Outlet } from 'react-router-dom'; 
import { AuthContext } from './AuthProvider.jsx';

export default function RutaProtegida({ children }) {
    const { user, loading } = useContext(AuthContext); 

    // Mientras comprueba localStorage no mostramos nada
    if (loading) return <div className="p-8 text-center">Cargando...</div>; 

    // Si no hay usuario autenticado, redirecciona a la vista Login
    if (!user) {
        return  <Navigate to="/login" replace />
    }

    // Si todo está bien, renderiza la vista solicitada
    return <Outlet />;
}; 