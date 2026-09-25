import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import apiClient from "../../api/client";
import { BotonAccion, } from '../ui/BotonAccion.jsx';
import { ModalRegistro } from "../ui/ModalRegistro.jsx";

export default function FichaAlumno() {
    const { id } = useParams();
    const [alumnos, setAlumnos] = useState([]);
    const [modalConfig, setModalConfig] = useState({ activo: false, alumnoId: null, tipo: '', nombre: '' });

    useEffect(() => {
        apiClient.get(`alumnos/?aula=${id}`)
            .then(response => {
                setAlumnos(response.data)
            })
            .catch(error => {
                console.error("Error al cargar los datos", error)
            })
    }, []);

    const abrirModal = (alumnoId, tipoAccion, nombreAlumno) => {
        setModalConfig({ activo: true, alumnoId: alumnoId, tipo: tipoAccion, nombre: nombreAlumno })

    };

    const confirmarRegistro = (alumnoId, tipo, textoDescipcion) => {
        apiClient.post('registros/', {
            alumno: alumnoId,
            tipo: tipo,
            descripcion: textoDescipcion
        })
            .then(response => {
                console.log(`Registro guardado`, response.data);
                setModalConfig({ activo: false, alumnoId: null, tipo: '', nombre: '' })
                alert("Registro Guardado Correctamente")
            })
            .catch(error => {
                console.error("Error al guardar el registro", error)
                alert('Hubo un error al guardar')
            });
    };

    return (
        //Contenedor transparente
        <div className="p-8">

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alumnos.map((alumno) => (
                    // Tarjeta estilo burbuja
                    <div key={alumno.id} className="bg-white p-6 rounded-4xl shadow-md gap-5 flex flex-col ">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 shrink-0 rounded-full bg-dia-secondary flex items-center justify-center font-quicksand font-bold text-xl text-dia-neutral">
                                {/* Primera letra del nombre */}
                                {alumno.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="">
                                <h2 className="text-xl font-quicksand font-bold tracking-tight">{alumno.nombre}</h2>
                                <p className="text-sm text-gray-400">Aula ID: {alumno.aula}</p>
                            </div>
                        </div>
                        {/* Personas Autorizadas */}
                        <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl">
                            <p className="text-sm font-semibold mb-2">Autorizados:</p>
                            <div className="flex flex-col gap2">
                                {alumno.autorizados.map(autorizado => (
                                    <p key={autorizado.id} className="text-sm flex items-center gap-2 text-gray-500">
                                        <span className="w-1.5 h-1.5 rounded-full bg-dia-primary"></span> {autorizado.nombre_completo}
                                    </p>
                                ))}
                            </div>
                        </div>
                        {/* Botones */}
                        <div className="flex justify-between items-center mt-2 p-4 border-t border-gray-100">
                            <BotonAccion icono="🍽️" texto="Comida" colorFondo="bg-dia-secondary" onClick={() => abrirModal(alumno.id, 'COMIDA', alumno.nombre)} />
                            <BotonAccion icono="🌙" texto="Siesta" colorFondo="bg-dia-primary" onClick={() => abrirModal(alumno.id, 'SIESTA', alumno.nombre)} />
                            <BotonAccion icono="💧" texto="Baño" colorFondo="bg-dia-tertiary" onClick={() => abrirModal(alumno.id, 'BAÑO', alumno.nombre)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL FLOTANTE */}
            <ModalRegistro
                config={modalConfig}
                onClose={() => setModalConfig({ activo: false, alumnoId: null, tipo: '', nombre: '' })}
                onGuardar={confirmarRegistro}
            />
        </div>
    )
}