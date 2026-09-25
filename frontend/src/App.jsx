import { Routes, Route, Navigate } from 'react-router-dom';
import FichaAlumno from "./components/FichaAlumno/FichaAlumno.jsx";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-dia-neutral font-vietnam antialiased">
      <Routes>
        <Route path="/" element={<Navigate to="/aula/1" />} />

        <Route path="/aula/:id" element={<FichaAlumno />} />

      </Routes>
    </div>
  );
};

export default App
