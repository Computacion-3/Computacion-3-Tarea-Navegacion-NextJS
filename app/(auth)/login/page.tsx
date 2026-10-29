'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError('Completa el correo y la contraseña.');
            return;
        }

        // replace: el login no debe quedar en el historial (botón "atrás")
        router.replace('/routines');
    };

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-md">
            <form onSubmit={handleSubmit} className="card-body gap-4">
                <div>
                    <h1 className="card-title text-2xl">GymRoutines</h1>
                    <p className="text-sm opacity-70">Ingresa para gestionar tus rutinas.</p>
                </div>

                {error && (
                    <div role="alert" className="alert alert-error alert-soft text-sm">
                        <span>{error}</span>
                    </div>
                )}

                <fieldset className="fieldset gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="fieldset-legend p-0">Correo</span>
                        <input
                            type="email"
                            className="input w-full"
                            placeholder="tu@correo.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="fieldset-legend p-0">Contraseña</span>
                        <input
                            type="password"
                            className="input w-full"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </fieldset>

                <button type="submit" className="btn btn-primary w-full">
                    Iniciar sesión
                </button>

                <p className="text-center text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="link link-primary">
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
