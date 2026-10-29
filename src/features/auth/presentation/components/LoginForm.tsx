'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoginParams } from '../../domain/repositories/auth.repository';

interface LoginFormProps {
    onSubmit: (params: LoginParams) => Promise<boolean>;
    isLoading: boolean;
    errorMessage: string | null;
    onClearError: () => void;
}

export function LoginForm({ onSubmit, isLoading, errorMessage, onClearError }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // Evita mostrar un error viejo (por ejemplo, del registro) al entrar a la pantalla
    useEffect(() => {
        onClearError();
    }, [onClearError]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!email.trim() || !password.trim()) {
            setFormError('Completa el correo y la contraseña.');
            return;
        }

        await onSubmit({ email: email.trim(), password });
    };

    const error = formError ?? errorMessage;

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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </label>
                </fieldset>

                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
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
