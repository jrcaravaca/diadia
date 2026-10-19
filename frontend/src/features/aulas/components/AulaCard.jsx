import { Link } from "react-router-dom";

export default function AulaCard({ aula }) {
    return (
        <Link
            to={`/aula/${aula.id}`}
            className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-dia-primary transition all flex items-center justify-between group'
        >
            <div>
                <h2 className='text-xl font-bold font-quicksand text-dia-neutral'>{aula.nombre}</h2>
                <p className='text-sm text-gray-400 mt-1'>Ir a clase</p>
                <div className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-dia-primary group-hover:text-white transition-colors'>
                    ➔
                </div>
            </div>
        </Link>
    );
}
