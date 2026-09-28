import { Routes, Route, Navigate } from 'react-router-dom';
import FichaAlumno from "./components/FichaAlumno/FichaAlumno.jsx";
import VistaAulas from './components/VistaAulas/VistaAulas.jsx';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      {/* HEADER */}
      <nav className='bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm'>
        <h1 className='text-2xl font-quicksand font-bold text-dia-primary'>Día a Día</h1>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-dia-primary text-white flex items-center justify-center font-bold'>
            P
          </div>
          <span className='text-sm font-semibold text-gray-500 hidden sm:block'>Panel de Profesor</span>
        </div>
      </nav>

      {/* CONTENIDO */}
      <Routes>
        <Route path="/" element={<VistaAulas />} />
        <Route path="/aula/:id" element={<FichaAlumno />} />
      </Routes>
    </div>
  );
};

export default App
