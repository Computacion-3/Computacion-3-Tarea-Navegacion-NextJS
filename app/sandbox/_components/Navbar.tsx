'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/routines', label: 'Rutinas' },
    
];

interface NavbarProps {
    variant: 'mobile' | 'desktop';
}

export function Navbar({ variant }: NavbarProps) {
    const pathname = usePathname();

    // Coincidencia exacta o subruta, para que /routines no active /routines-clean
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    // El dropdown de daisyUI se abre por foco: al navegar quitamos el foco para cerrarlo
    const closeDropdown = () => (document.activeElement as HTMLElement | null)?.blur();

    const items = links.map(({ href, label }) => (
        <li key={href}>
            <Link
                href={href}
                className={isActive(href) ? 'menu-active' : ''}
                aria-current={isActive(href) ? 'page' : undefined}
                onClick={variant === 'mobile' ? closeDropdown : undefined}
            >
                {label}
            </Link>
        </li>
    ));

    if (variant === 'desktop') {
        return <ul className="menu menu-horizontal gap-1 px-1">{items}</ul>;
    }

    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-square" aria-label="Abrir menú">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 gap-1 rounded-box bg-base-100 p-2 shadow">
                {items}
            </ul>
        </div>
    );
}
