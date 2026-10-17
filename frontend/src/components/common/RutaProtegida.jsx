import { useContext } from "react";
import { Navigate } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthContext.jsx'; 

export default function RutaProtegida({ children }) {
    const { user, loading } = useContext(AuthContext); 

    // Mientras comprueba localStorage no mostramos nada
    if (loading) return null; 

    // Si no hay usuario autenticado, redirecciona a la vista Login
    if (!user) {
        return  <Navigate to="/login" replace />
    }

    // Si todo está bien, renderiza la vista solicitada
    return children; 
}; 