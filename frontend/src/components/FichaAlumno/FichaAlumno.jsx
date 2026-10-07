import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import apiClient from "../../api/client";
import { BotonAccion, } from '../ui/BotonAccion.jsx';
import { ModalRegistro } from "../ui/ModalRegistro.jsx";
import TarjetaAlumno from "./TarjetaAlumno.jsx";

export default function FichaAlumno() {
    const { id } = useParams();
    const [alumnos, setAlumnos] = useState([]);
    const [modalConfig, setModalConfig] = useState({ activo: false, alumnoId: null, tipo: '', nombre: '' });
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        apiClient.get(`alumnos/?aula=${id}`)
            .then(response => {
                setAlumnos(response.data)
            })
            .catch(error => {
                console.error("Error al cargar los datos", error)
            })
    }, [id]);

    const abrirModal = (alumnoId, tipoAccion, nombreAlumno) => {
        setModalConfig({ activo: true, alumnoId: alumnoId, tipo: tipoAccion, nombre: nombreAlumno })
    };

    const confirmarRegistro = (alumnoId, tipo, textoDescipcion, fotoArchivo) => {

        const formData = new FormData();

        formData.append('alumno', alumnoId)
        formData.append('tipo', tipo)
        formData.append('descripcion', textoDescipcion)

        if (fotoArchivo) {
            formData.append('foto', fotoArchivo)
        }

        apiClient.post('registros/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setModalConfig({ activo: false, alumnoId: null, tipo: '', nombre: '' });
                setRefresh(prev => prev + 1);
            })
            .catch(error => {
                console.error("Error al guardar el registro", error)
                alert('Hubo un error al guardar')
            })
    };

    return (
        //Contenedor transparente
        <div className="p-8">
            {/* Boton de volver */}
            <Link
                to="/"
                className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-dia-primary transition-color mb-6">
                ← Volver a aulas
            </Link>
            {/* Ficha ALumno */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alumnos.map((alumno) => (
                    <TarjetaAlumno
                        key={alumno.id}
                        alumno={alumno}
                        onAbrirModal={abrirModal}
                        refresh={refresh}
                    />
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