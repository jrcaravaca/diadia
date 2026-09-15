import { useState, useEffect } from "react";
import apiClient from "../api/client";

export default function FichaAlumno() {
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        apiClient.get('alumnos/')
            .then(response => {
                setAlumnos(response.data)
            })
            .catch(error => {
                console.error("Error al cargar los datos", error)
            })
    }, []);

    return (
        <div className="p8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Alumnos</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alumnos.map((alumno) => (
                    <div key={alumno.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-2">{alumno.nombre}</h2>
                        <p className="text-sm text-gray-500 mb-4">Aula ID: {alumno.aula}</p>

                        <div className="bgl-blue-50 p-3 rounded-lg">
                            <h3 className="text-sm font-semibold text-blue-800 mb-2"> Personas Autorizadas:</h3>
                            {alumno.autorizados.length > 0 ? (
                                <ul className="text-sm text-gray-700">
                                    {alumno.autorizados.map(autorizado => (
                                        <li key={autorizado.id} className="mb-1">
                                            • {autorizado.nombre_completo} (DNI: {autorizado.dni})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">Sin autorizados registrados.</p>
                            )}
                        </div>
                    </div>
                ))

                }

            </div>
        </div>
    )
}