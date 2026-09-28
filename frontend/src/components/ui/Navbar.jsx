export const Navbar = () => {
    return (
        <nav className='bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm'>
            <h1 className='text-2xl font-quicksand font-bold text-dia-primary'>Día a Día</h1>
            <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-dia-primary text-white flex items-center justify-center font-bold'>
                    P
                </div>
                <span className='text-sm font-semibold text-gray-500 hidden sm:block'>Panel de Profesor</span>
            </div>
        </nav>
    )
}