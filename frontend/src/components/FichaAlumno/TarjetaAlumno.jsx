import { useState, useEffect } from "react";
import apiClient from "../../api/client";
import { BotonAccion } from "../ui/BotonAccion";

export default function TarjetaAlumno({ alumno, onAbrirModal, refresh }) {
    const [registros, setRegistros] = useState([])

    useEffect(() => {
        apiClient.get(`registros/?alumno=${alumno.id}`)
            .then(response => {
                setRegistros(response.data);
            })
            .catch(error => console.error("Error cargando registros:", error));
    }, [alumno.id, refresh]);

    const borrarRegistro = (idRegistro) => {
        if (window.confirm("¿Seguro que quieres borrar este registro?")) {
            apiClient.delete(`registros/${idRegistro}/`)
                .then(() => {
                    setRegistros(prevRegistros => prevRegistros.filter(reg => reg.id !== idRegistro))
                })
                .catch(error => {
                    console.error("Error al borrar el registro", error)
                    alert("No se puede borrar el registro.")
                });
        }
    };

    return (
        <div className="bg-white p-6 rounded-4xl shadow-md gap-5 flex flex-col">

            {/* DATOS ALUMNO */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-full bg-dia-secondary flex items-center justify-center 
                                font-quicksand font-bold text-xl text-dia-neutral">
                    {alumno.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-quicksand font-bold tracking-tight">{alumno.nombre}</h2>
                    <p className="text-sm text-gray-400">Aula: {alumno.aula} </p>
                </div>
            </div>


            {/* AUTORIZADOS */}
            <div className="p4 bg-gray-50/80 border border-gray-100 rounded-2xl">
                <p className="text-sm font-semibold mb-2">Autorizados:</p>
                <div className="flex flex-col gap-2">
                    {alumno.autorizados.map(autorizado => (
                        <p key={autorizado.id} className="text-sm flex items-center gap-2 text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-dia-primary"></span> {autorizado.nombre_completo}
                        </p>
                    ))}
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-between items-center mt-2 p-4 border-t border-gray-100">
                <BotonAccion icono="🍽️" texto="Comida" colorFondo="bg-dia-secondary" onClick={() => onAbrirModal(alumno.id, 'COMIDA', alumno.nombre)} />
                <BotonAccion icono="🌙" texto="Siesta" colorFondo="bg-dia-primary" onClick={() => onAbrirModal(alumno.id, 'SIESTA', alumno.nombre)} />
                <BotonAccion icono="💧" texto="Baño" colorFondo="bg-dia-tertiary" onClick={() => onAbrirModal(alumno.id, 'BAÑO', alumno.nombre)} />
            </div>

            {/* HISTORIAL DE REGISTROS */}
            <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Actividad</h4>
                {registros.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Sin registros</p>
                ) : (
                    <ul className="space-y-2">
                        {registros.map(reg => (
                            <li key={reg.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 block">
                                <div className="flex justify-between w-full items-center">
                                    <span className="font-semibold text-dia-primary">{reg.tipo}</span>
                                    <span className="text-gray-500">
                                        {new Date(reg.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <button
                                        onClick={() => borrarRegistro(reg.id)}
                                        className="text-gray-300 hover:text-red-500 transition-color p-1 cursor-pointer"
                                        title="Eliminar registro"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                {reg.descripcion && (
                                    <p className="text-xs text-gray-500 mt-1 italic text-gray-60">"{reg.descripcion}"</p>
                                )}
                                {reg.foto && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <img
                                            src={reg.foto.startsWith('http') ? reg.foto : `http://127.0.0.1:8000${reg.foto}`}
                                            alt={`Registro de ${reg.tipo}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-100"
                                        />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    )
}