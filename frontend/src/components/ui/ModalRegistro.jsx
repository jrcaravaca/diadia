import { useState, useEffect } from 'react';

export const ModalRegistro = ({ config, onClose, onGuardar }) => {
    const [descripcion, setDescripcion] = useState('')

    useEffect(() => {
        if (config.activo) {
            setDescripcion('');
        }
    }, [config.activo]);

    if (!config.activo) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-xl font-quicksand font-bold mb-1">Registro de {config.tipo}</h3>
                <p className="text-sm text-gray-500 mb-4">Añadiendo información para {config.nombre}</p>
                <textarea
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm mb-4 outline-done focus:border-dia-primary"
                    rows="3"
                    placeholder="Observaciones"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
                <div className="flex gap-3">
                    <button
                        className="flex-1 py-3 rounded-xl font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200"
                        onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="flex-1 py-3 roudend-xl font-semibold text-white bg-dia-primary hover:opacity-90"
                        onClick={() => onGuardar(config.alumnoId, config.tipo, descripcion)}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}