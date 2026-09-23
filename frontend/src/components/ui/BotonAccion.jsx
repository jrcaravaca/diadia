export const BotonAccion = ({ icono, texto, colorFondo }) => {
    return (
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-full ${colorFondo} flex items-center justify-center shadow-sm`}>
                <span className="text-lg">{icono}</span>
            </div>
            <span className="text-xs font-semibold text-gray-500">{texto}</span>
        </div>
    )
}