import { useState } from "react"; 

export default function ModalAutorizados({ autorizados, alumnoNombre, onClose}) {
    const [fotoAmpliada, setFotoAmpliada] = useState(null); 

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Personas Autorizadas</h2>
                        <p className="text-xs text-gray-500">Recogida de: <span className="font-semibold text-dia-primary">{alumnoNombre}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"    
                    >
                        x
                    </button>
                </div>
                {/* LISTA DE AUTORIZADOS */}
                <div className="mt-4 space-y-4">
                    {autorizados && autorizados.length > 0 ? (
                        autorizados.map((aut) => (
                            <div key={aut.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800">{aut.nombre_completo}</p>
                                        <p className="text-xs text-gray-500 font-mono">DNI:d {aut.dni}</p>
                                    </div>
                                </div>

                                {aut.foto_dni ? (
                                    <div>
                                        <img 
                                            src={aut.foto_dni} 
                                            alt={`DNI de ${aut.nombre_completo}`} 
                                            onClick={() => setFotoAmpliada(aut.foto_dni)}
                                            className="lw-full h-32 object-cover roudend-xl bordelr border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                        <p className="text-[10px] text-gray-400 text-center mt-1">Haz clic en la imagen para amplicar</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-20 bg-gray-200/50 rounded-xl flex items-center justify-center text-xs text-gray-400 italic">
                                        Sin foto DNI registrada
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">No hay personas autorizadas registradas para este alumno</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Cerrar
                </button>
            </div>

            {fotoAmpliada && (
                <div
                    className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setFotoAmpliada(null)}    
                >
                    <div className="relative max-w-3xl w-full">
                        <img 
                            src={fotoAmpliada} 
                            alt="DNI Ampliado"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
                         />
                         <p className="text-white text-center text-xs mt-2">Toca en cualquier lugar para cerrar</p>
                    </div>
                </div>
            )}
        </div>

    
    )
}