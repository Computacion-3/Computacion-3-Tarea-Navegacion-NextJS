'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RegisterParams } from '../../domain/repositories/auth.repository';

interface RegisterFormProps {
    onSubmit: (params: RegisterParams) => Promise<boolean>;
    isLoading: boolean;
    errorMessage: string | null;
    onClearError: () => void;
}

export function RegisterForm({ onSubmit, isLoading, errorMessage, onClearError }: RegisterFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // Evita mostrar un error viejo (por ejemplo, del login) al entrar a la pantalla
    useEffect(() => {
        onClearError();
    }, [onClearError]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setFormError('Completa todos los campos.');
            return;
        }

        // La confirmación solo existe en la UI; las reglas del negocio las valida el caso de uso
        if (password !== confirmPassword) {
            setFormError('Las contraseñas no coinciden.');
            return;
        }

        await onSubmit({ name: name.trim(), email: email.trim(), password });
    };

    const error = formError ?? errorMessage;

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-md">
            <form onSubmit={handleSubmit} className="card-body gap-4">
                <div>
                    <h1 className="card-title text-2xl">Crear cuenta</h1>
                    <p className="text-sm opacity-70">Regístrate para empezar a armar tus rutinas.</p>
                </div>

                {error && (
                    <div role="alert" className="alert alert-error alert-soft text-sm">
                        <span>{error}</span>
                    </div>
                )}

                <fieldset className="fieldset gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="fieldset-legend p-0">Nombre completo</span>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="Ana Pérez"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </label>

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
                            placeholder="Mínimo 8 caracteres, con letras y números"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="fieldset-legend p-0">Confirmar contraseña</span>
                        <input
                            type="password"
                            className="input w-full"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </label>
                </fieldset>

                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                    Crear cuenta
                </button>

                <p className="text-center text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="link link-primary">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
