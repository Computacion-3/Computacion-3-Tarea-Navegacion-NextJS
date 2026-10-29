'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/routines', label: 'Rutinas' },
    { href: '/exercises', label: 'Ejercicios' },
    { href: '/progress', label: 'Progreso' },
];

export function Navbar() {
    const pathname = usePathname();

    // Coincidencia exacta o subruta, para que /routines no active /routines-clean
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <ul className="flex items-center gap-1 overflow-x-auto">
            {links.map(({ href, label }) => {
                const active = isActive(href);
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            aria-current={active ? 'page' : undefined}
                            className={`inline-block whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-black text-white'
                                    : 'text-neutral-800 hover:bg-neutral-100'
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}