import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import apiClient from "../../api/client";

export default function VistaAulas() {
    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        apiClient.get('aulas/')
            .then(response => {
                console.log(response.data)
                const datosAulas = response.data.results ? response.data.results : response.data;
                setAulas(datosAulas)
            })
            .catch(error => {
                console.error("Error al cargar las aulas", error)
            })

    }, []);

    console.log(aulas)

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-quicksand font-bold mb-6'>Selecciona un Aula</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {aulas.map((aula) => (
                    <Link
                        key={aula.id}
                        to={`aula/${aula.id}`}
                        className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 
                                 hover:shadow-md hover:border-dia-primary transition all flex items-center justify-between group'>
                        <div>
                            <h2 className='text-xl font-bold font-quicksand text-dia-neutral'>{aula.nombre}</h2>
                            <p className='text-sm text-gray-400 mt-1'>Ir a clase</p>
                            <div className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 
                                        group-hover:bg-dia-primary group-hover:text-white transition-colors'>
                                ➔
                            </div>
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    )
}