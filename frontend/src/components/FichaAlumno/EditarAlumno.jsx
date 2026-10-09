import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from "../../api/client";

export default function EditarAlumno() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Desplegables
    const [aulas, setAulas] = useState([]);
    const [familiaresLista, setFamiliaresLista] = useState([]);

    // Datos Alumno
    const [nombre, setNombre] = useState('');
    const [aulaId, setAulaId] = useState('');
    const [familiaresSeleccionados, setFamiliaresSeleccionados] = useState([])

    //Estados de los autorizados
    const [autorizados, setAutorizados] = useState([]);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoDNI, setNuevoDni] = useState('');
    const [nuevaFoto, setNuevaFoto] = useState('');

    // Cargar datos al iniciar el componente
    useEffect(() => {
        // Aulas
        apiClient.get('aulas/')
            .then(res => setAulas(res.data.results ? res.data.results : res.data))
            .catch(err => console.error("Error cargando aulas", err));

        // Familiares
        apiClient.get('familiares/')
            .then(res => setFamiliaresLista(res.data.results ? res.data.results : res.data))
            .catch(err => console.error("Error al cargar familiares", err));

        // Alumno Actual
        apiClient.get(`alumnos/${id}/`)
            .then(res => {
                setNombre(res.data.nombre);
                setAulaId(res.data.aula);
                setFamiliaresSeleccionados(res.data.familiares)
                setAutorizados(res.data.autorizados || [])
            })
            .catch(err => console.error("Error cargando alumno", err));

    }, [id])

    // Selección múltiple del <select>
    const handleFamiliaresChange = (e) => {
        // Convierte las opciones seleccionadas en un array de números (IDs)
        const selecciones = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFamiliaresSeleccionados(selecciones);
    };

    // Friccion POSITIVA de seguridad
    const guardarCambios = () => {
        //El objetivo de esta función es que el usuario que guarde los datos, se aseguré de que los datos son correctos
        if (!nombre.trim() || !aulaId) {
            alert("El nombre y el aula son obligatorios");
            return
        }

        // BARRERA DE SEGURIDAD
        if (familiaresSeleccionados.length > 0) {
            const nombresFamilias = familiaresLista
                .filter(fam => familiaresSeleccionados.includes(fam.id))
                .map(fam => `${fam.username} (DNI: ${fam.dni})`)
                .join(' y ');

            const mensajeSeguridad = `⚠️ ATENCIÓN: Privacidad de datos\n\nEstás a punto de dar acceso a toda la información, fotos y registros de ${nombre} a:\n\n${nombresFamilias}\n\n¿Confirmas que estos padres corresponden estrictamente a este alumno?`;

            const seguro = window.confirm(mensajeSeguridad);

            // Si el usuario pulsa cancelar, abortamos la función aquí mismo
            if (!seguro) return;
        } else {
            const seguroVacio = window.confirm(`⚠️ ATENCIÓN: ${nombre} se va a guardar SIN ningún familiar asignado.\n\n¿Estás seguro de continuar?`)
            if (!seguroVacio) return;
        }

        // Si pasa la seguridad continuamos aquí, enviamos el PUT a Django
        apiClient.put(`alumnos/${id}/`, {
            nombre: nombre,
            aula: aulaId,
            familiares: familiaresSeleccionados
        })
            .then(response => {
                navigate(`/aula/${aulaId}`);
            })
            .catch(error => {
                console.error("Error al actualizar", error)
                alert("Hubo un error al guardar los cambios")
            });
    };

    // Función añadir auturizados
    const agregarAutorizado = (e) => {
        e.preventDefault();

        if (autorizados.length >= 4) {
            alert("El sistema solo permite un máximo de 4 personas autorizadas.")
            return;
        }

        if (!nuevoNombre.trim() || !nuevoDNI.trim()) {
            alert('El nombre completo y el DNI son obligatorios.')
            return
        }

        const formData = new FormData();
        formData.append('alumno', id);
        formData.append('nombre_completo', nuevoNombre);
        formData.append('dni', nuevoDNI);
        if (nuevaFoto) {
            formData.append('foto_dni', nuevaFoto);
        }

        apiClient.post('autorizados/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => {
                setAutorizados([...autorizados, res.data]);
                setNuevoNombre('');
                setNuevoDni('');
                setNuevaFoto(null)
            })
            .catch(err => {
                console.error("Error al añadir autorizado", err);
                alert('Error al guardar persona autorizada')
            });

    }

    // Función eleminar autorizados

    const eliminarAutorizado = (autorizadoId) => {
        if (!window.confirm("¿Seguro que quieres eliminar a esta persona autorizada?")) return;

        apiClient.delete(`autorizados/${autorizadoId}`)
            .then(() => {
                setAutorizados(autorizados.filter(a => a.id !== autorizadoId));
            })
            .catch(err => console.error("Error al eliminar autorizado", err))
    };


    return (
        <div className="p-8 max-w-xl mx-auto">
            <Link to="/" className='inline-flex items-center text-sm font-semibold text-gray-500 hover:text-dia-primary transition-color mb-6'>
                ← Volver
            </Link>

            <h1 className='text-3xl font-quicksand font-bold mb-6 text-dia-neutral'>Editar Alumno</h1>

            <form className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6'>

                {/* NOMBRE */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Nombre y Apellidos</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className='w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dia-primary'
                        required
                    />
                </div>

                {/* AULA */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Cambiar de Aula</label>
                    <select
                        value={aulaId}
                        onChange={(e) => setAulaId(e.target.value)}
                        className='w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dia-primary'
                        required
                    >
                        <option value="">-- SELECCIONA UN AULA --</option>
                        {aulas.map(aula => (
                            <option value={aula.id} key={aula.id}>{aula.nombre}</option>
                        ))}

                    </select>
                </div>

                {/* FAMILIARES */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Vincular Familiares (Padres/Tutores)
                        <span className='block text-xs text-gray-400 mt-1 font-normal'>Manten pulsado Ctrl (Windows) o Cmd (Mac) para seleccionar varios.</span>
                    </label>
                    <select
                        multiple
                        value={familiaresSeleccionados}
                        onChange={handleFamiliaresChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dia-primary h-32"
                    >
                        {familiaresLista.map(fam => (
                            <option key={fam.id} value={fam.id}>
                                {fam.username} - DNI: {fam.dni}
                            </option>
                        ))}
                    </select>
                </div>

                {/* BOTONERA */}
                <div className='pt-4 flex justify-end border-t border-gray-100'>
                    <button
                        type='button'
                        onClick={guardarCambios}
                        className='px-6 py-2 bg-dia-primary text-white hover:bg-blue-600 rounded-xl font-medium transition-colors'>
                        Guardar Cambios
                    </button>
                </div>
            </form>

            <div className='mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6'>
                <h2 className='text-xl font-bold text-dia-neutral'>Personas Autorizadas para Recogida</h2>

                {/* Lista de autorizados existentes */}
                <div className='space-y-3'>
                    {autorizados.map(aut => (
                        <div key={aut.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100'>
                            <div>
                                <p className='font-semibold text-gray-800'>{aut.nombre_completo}</p>
                                <p className='text-xs text-gray-500'>DNI: {aut.dni}</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => eliminarAutorizado(aut - id)}
                                className='text-red-500 hover:text-red-700 text-sm font-medium'
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    {autorizados.length === 0 && (
                        <p className='text-sm text-gray-400 italic'>No hay personas autorizadas registradas.</p>
                    )}
                </div>

                {/* Form para añadir autorizados */}
                {autorizados.length < 4 && (
                    <form onSubmit={agregarAutorizado} className='pt-4 border-t border-gray-100 space-y-4'>
                        <h3 className='text-sm font-semibold text-gray-700'>Añadir nueva persona</h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <input
                                type="text"
                                placeholder='Nombre Completo'
                                value={nuevoNombre}
                                onChange={(e) => setNuevoNombre(e.target.value)}
                                className='p-2 border border-gray-200 rounded-lg text-sm'
                            />

                            <input
                                type="text"
                                placeholder='DNI / NIE'
                                value={nuevoDNI}
                                onChange={(e) => setNuevoDni(e.target.value)}
                                className='p-2 border border-gray-200 rounded-lg text-sm'
                            />
                        </div>
                        <div>
                            <label className='block text-xs text-gray-500 mb-1'>Foto DNI(Opcional):</label>
                            <input
                                type="file"
                                accept='image/*'
                                onChange={(e) => setNuevaFoto(e.target.files[0])}
                                className='text-xs text-gray-500'
                            />
                        </div>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition-colors'
                        >
                            Guardar Autorizado
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}