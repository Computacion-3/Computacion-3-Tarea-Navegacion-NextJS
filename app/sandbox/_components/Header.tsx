import Link from 'next/link';
import { Navbar } from './Navbar';


export function Header() {
    return (
        <header className="navbar sticky top-0 z-20 bg-base-100 px-2 shadow-sm md:px-6">
            <div className="navbar-start gap-1">
                <div className="md:hidden">
                    <Navbar variant="mobile" />
                </div>
                <Link href="/routines" className="btn btn-ghost px-2 text-lg font-bold md:text-xl">
                    GymRoutines
                </Link>
            </div>

            <nav className="navbar-center hidden md:flex" aria-label="Principal">
                <Navbar variant="desktop" />
            </nav>

            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="avatar avatar-placeholder btn btn-ghost btn-circle" aria-label="Menú de usuario">
                        <div className="w-10 rounded-full bg-neutral text-neutral-content">
                            <span>U</span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-48 rounded-box bg-base-100 p-2 shadow">
                        <li className="menu-title">Usuario</li>
                        <li>
                            <Link href="/login">Cerrar sesión</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
