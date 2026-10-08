import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/client";

export default function RegistrarAlumno() {
    const [aulas, setAulas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [aulaId, setAulaId] = useState('');
    const navigate = useNavigate();

    // Cargar las aulas al entrar a la vista
    useEffect(() => {
        apiClient.get('aulas/')
            .then(response => {
                const datosAulas = response.data.results ? response.data.results : response.data;
                setAulas(datosAulas)
            })
            .catch(error => console.error("Error al cargar las aulas", error))
    }, []);

    const guardarAlumno = (e, seguirAñadiendo) => {
        e.preventDefault();

        if (!nombre.trim() || !aulaId) {
            alert("Por favor introduce el nombre y selecciona un aula.")
            return;
        }

        apiClient.post('alumnos/', {
            nombre: nombre,
            aula: aulaId
        })
            .then(response => {
                if (seguirAñadiendo) {
                    setNombre('')
                } else {
                    navigate('/')
                }
            })
            .catch(error => {
                console.error("Error al guardar el alumno", error);
                alert("Hubo un error al guardar el alumno.")
            });
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-dia-primary transition-color mb-6">
                ← Volver
            </Link>

            <h1 className="text-3xl font-quicksand font-bold mb-6 text-dia-neutral">Añadir Alumno</h1>

            <form className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6 ">

                {/* Desplegable Aulas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aula Asignada</label>
                    <select
                        value={aulaId}
                        onChange={(e) => setAulaId(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dia-primary"
                        required>
                        <option value="">-- Selecciona un aula --</option>
                        {aulas.map(aula => (
                            <option key={aula.id} value={aula.id}>{aula.nombre}</option>
                        ))}

                    </select>
                </div>

                {/* Input Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre y Apellidos</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Ana García"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dia-primary"
                        required />
                </div>

                {/* Botonera */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={(e) => guardarAlumno(e, true)}
                        className="px-4 py-2 border border-dia-primary text-dia-primary hover:bg-blue-50 rounded-xl font-medium transition-colors">
                        Guardar y añadir otro
                    </button>
                    <button
                        type="button"
                        onClick={(e) => guardarAlumno(e, false)}
                        className="px-4 py-2 bg-dia-primary text-white hover:bg-blue-600 rounded-xl font-medium transition-colors">
                        Guardar
                    </button>
                </div>

            </form>
        </div>
    )
}