'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/presentation/hooks/use-auth';
import { RegisterForm } from '@/src/features/auth/presentation/components/RegisterForm';
import { RegisterParams } from '@/src/features/auth/domain/repositories/auth.repository';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, errorMessage, clearError } = useAuth();

    const handleRegister = async (params: RegisterParams): Promise<boolean> => {
        const success = await register(params);
        if (success) {
            // El registro deja la sesión iniciada; replace evita volver al formulario con "atrás"
            router.replace('/routines');
        }
        return success;
    };

    return (
        <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={clearError}
        />
    );
}
