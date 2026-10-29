'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { useAuth } from '@/src/features/auth/presentation/hooks/use-auth';

export function Header() {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            router.replace('/login');
        }
    };

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
                        {user?.initials ?? 'U'}
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow"
                    >
                        <li className="menu-title">
                            {user ? (
                                <span className="flex flex-col normal-case">
                                    <span className="font-semibold text-neutral-900">{user.displayName}</span>
                                    <span className="text-xs font-normal">{user.email}</span>
                                </span>
                            ) : (
                                'Usuario'
                            )}
                        </li>
                        <li>
                            <button type="button" onClick={handleLogout} disabled={isLoading}>
                                Cerrar sesión
                            </button>
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
