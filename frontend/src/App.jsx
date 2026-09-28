import { Routes, Route, Navigate } from 'react-router-dom';
import FichaAlumno from "./components/FichaAlumno/FichaAlumno.jsx";
import VistaAulas from './components/VistaAulas/VistaAulas.jsx';
import { Navbar } from './components/ui/Navbar.jsx';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      {/* HEADER */}
      <Navbar />

      {/* CONTENIDO */}
      <Routes>
        <Route path="/" element={<VistaAulas />} />
        <Route path="/aula/:id" element={<FichaAlumno />} />
      </Routes>
    </div>
  );
};

export default App
