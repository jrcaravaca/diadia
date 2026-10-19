import { useContext }from 'react'; 
import { AuthContext } from '../../features/auth/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const { logout, user } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    const handleLogout = () => {
        logout(); 
        navigate('/login');
    }

    return (
        <nav className='bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm'>
            <h1 className='text-2xl font-quicksand font-bold text-dia-primary'>Día a Día</h1>
            <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-dia-primary text-white flex items-center justify-center font-bold'>
                    {user?.username[0]?.toUpperCase()}
                </div>
                <span className='text-sm font-semibold text-gray-500 hidden sm:block'>Hola, {user?.username} </span>
                <button
                    onClick={handleLogout}
                    className='px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl font-semibold hover:bg-red-100 transition-all cursor-pointer'
                >
                    Cerrar Sesión
                </button>
                
            </div>
        </nav>
    )
}