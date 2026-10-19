import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { obtenerAulas } from "../features/aulas/aulas.api.js";
import AulaCard from "../features/aulas/components/AulaCard.jsx";

export default function AulasPage() {
    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        obtenerAulas()
            .then(setAulas)
            .catch(error => {
                console.error("Error al cargar las aulas", error)
            })

    }, []);

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-quicksand font-bold mb-6'>Selecciona un Aula</h1>

            <Link
                to="/nuevo-alumno"
                className='bg-dia-primary text-white px-5 py-2 rounded-xl font-medium shadow-sm hover:bg-blue-600 transition-colors'
            >
                + Añadir Alumno
            </Link>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
                {aulas.map((aula) => (
                    <AulaCard key={aula.id} aula={aula} />
                ))}
            </div>
        </div>
    )
}