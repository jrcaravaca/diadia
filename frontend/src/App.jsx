import { Routes, Route, Navigate } from 'react-router-dom';
import DetalleAula from './components/VistaAulas/DetalleAula.jsx'
import VistaAulas from './components/VistaAulas/VistaAulas.jsx';
import RegistrarAlumno from './components/FichaAlumno/RegistrarAlumno.jsx';
import EditarAlumno from './components/FichaAlumno/EditarAlumno.jsx';
import { Navbar } from './components/ui/Navbar.jsx';
import Login from './pages/Login.jsx';
import RutaProtegida from './components/common/RutaProtegida.jsx';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      {/* HEADER */}
      <Navbar />

      {/* CONTENIDO */}
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/login' element={<Login />}></Route>

        {/* Rutas Protegidas */}
        <Route path="/" element={<RutaProtegida><VistaAulas /></RutaProtegida>} />
        <Route path="/aula/:id" element={<RutaProtegida><DetalleAula /></RutaProtegida>} />
        <Route path="/nuevo-alumno" element={<RutaProtegida><RegistrarAlumno /></RutaProtegida>} />
        <Route path="/editar-alumno/:id" element={<RutaProtegida><EditarAlumno /></RutaProtegida>} />

      </Routes>
    </div>
  );
};

export default App
