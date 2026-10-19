import { Routes, Route } from 'react-router-dom';
import DetalleAulaPage from '../pages/DetalleAulaPage.jsx';
import AulasPage from '../pages/AulasPage.jsx';
import RegistrarAlumno from '../features/alumnos/components/RegistrarAlumno.jsx';
import EditarAlumno from '../features/alumnos/components/EditarAlumno.jsx';
import { Navbar } from '../shared/components/Navbar.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProtectedRoute from '../features/auth/ProtectedRoute.jsx';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      {/* HEADER */}
      <Navbar />

      {/* CONTENIDO */}
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/login' element={<LoginPage />}></Route>

        {/* Rutas Protegidas */}
        <Route path="/" element={<ProtectedRoute><AulasPage /></ProtectedRoute>} />
        <Route path="/aula/:id" element={<ProtectedRoute><DetalleAulaPage /></ProtectedRoute>} />
        <Route path="/nuevo-alumno" element={<ProtectedRoute><RegistrarAlumno /></ProtectedRoute>} />
        <Route path="/editar-alumno/:id" element={<ProtectedRoute><EditarAlumno /></ProtectedRoute>} />

      </Routes>
    </div>
  );
};

export default App
