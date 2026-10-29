'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [registered, setRegistered] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegistered(false);

        if (!name.trim() || !email.trim() || !password || !confirm) {
            setError('Completa todos los campos.');
            return;
        }

        if (password !== confirm) {
            setPasswordMismatch(true);
            setError('');
            return;
        }

        setPasswordMismatch(false);
        setError('');
        setRegistered(true);
    };

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-md">
            <form onSubmit={handleSubmit} className="card-body gap-4">
                <div>
                    <h1 className="card-title text-2xl">Crear cuenta</h1>
                </div>

                {error && (
                    <div role="alert" className="alert alert-error alert-soft text-sm">
                        <span>{error}</span>
                    </div>
                )}

                {registered && (
                    <div role="alert" className="alert alert-success alert-soft text-sm">
                        <span>
                            Cuenta creada.{' '}
                            <Link href="/login" className="link font-semibold">
                                Inicia sesión
                            </Link>
                        </span>
                    </div>
                )}

                <fieldset className="fieldset gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="fieldset-legend p-0">Nombre</span>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="Tu nombre"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <label className="flex flex-col gap-1">
                            <span className="fieldset-legend p-0">Contraseña</span>
                            <input
                                type="password"
                                className={`input w-full ${passwordMismatch ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="fieldset-legend p-0">Confirmar contraseña</span>
                            <input
                                type="password"
                                className={`input w-full ${passwordMismatch ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={passwordMismatch}
                                aria-describedby={passwordMismatch ? 'confirm-error' : undefined}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </label>
                    </div>

                    {passwordMismatch && (
                        <p id="confirm-error" className="text-sm text-error">
                            Las contraseñas no coinciden.
                        </p>
                    )}
                </fieldset>

                <button type="submit" className="btn btn-primary w-full">
                    Registrarse
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
