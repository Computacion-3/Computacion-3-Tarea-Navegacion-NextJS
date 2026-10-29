'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/presentation/hooks/use-auth';
import { LoginForm } from '@/src/features/auth/presentation/components/LoginForm';
import { LoginParams } from '@/src/features/auth/domain/repositories/auth.repository';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, errorMessage, clearError } = useAuth();

    const handleLogin = async (params: LoginParams): Promise<boolean> => {
        const success = await login(params);
        if (success) {
            // replace: el login no debe quedar en el historial (botón "atrás")
            router.replace('/routines');
        }
        return success;
    };

    return (
        <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={clearError}
        />
    );
}
