import Link from 'next/link';
import { Navbar } from './Navbar';

export function Header() {
    return (
        <header className="sticky top-0 z-20 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                <Link href="/routines" className="text-xl font-bold text-neutral-900">
                    GymRoutines
                </Link>

                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        aria-label="Menú de usuario"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#4330d8] text-sm font-bold text-white"
                    >
                        AP
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-10 mt-3 w-48 rounded-box bg-base-100 p-2 shadow"
                    >
                        <li className="menu-title">Usuario</li>
                        <li>
                            <Link href="/login">Cerrar sesión</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <nav className="border-t border-neutral-200 px-4 py-3 md:px-4" aria-label="Principal">
                <Navbar />
            </nav>
        </header>
    );
}