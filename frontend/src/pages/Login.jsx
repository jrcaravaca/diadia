import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const { login } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(''); 

        try {
            await login(username, password); 
            navigate('/'); 
        } catch (err) {
            console.error(err); 
            setError('Usuario o contraseña incorrectos');
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-mb border border-gray-100 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 font-quicksand">DiaDia</h1>
                    <p className="text-sm text-gray-400 mt-1">Gestión Escolar Infantil</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-semibold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus.border-dia-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Contraseña</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dia-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-dia-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );

}