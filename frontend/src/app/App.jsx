import { Routes, Route, Outlet } from 'react-router-dom';
import DetalleAulaPage from '../pages/DetalleAulaPage.jsx';
import AulasPage from '../pages/AulasPage.jsx';
import RegistrarAlumno from '../features/alumnos/components/RegistrarAlumno.jsx';
import EditarAlumno from '../features/alumnos/components/EditarAlumno.jsx';
import { Navbar } from '../shared/components/Navbar.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProtectedRoute from '../features/auth/ProtectedRoute.jsx';

function MainLayout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='container mx-auto px-4 py-6'>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/login' element={<LoginPage />}></Route>

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AulasPage />} />
            <Route path="/aula/:id" element={<DetalleAulaPage />} />
            <Route path="/nuevo-alumno" element={<RegistrarAlumno />} />
            <Route path="/editar-alumno/:id" element={<EditarAlumno />} />
          </Route>
        </Route>
        

      </Routes>
    </div>
  );
};

