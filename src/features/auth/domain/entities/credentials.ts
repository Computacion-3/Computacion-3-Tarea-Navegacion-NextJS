// Reglas de validación de datos de acceso. Las reutilizan la entidad y los casos de uso.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => (email ?? '').trim().toLowerCase();

export function validateFullName(name: string): void {
    const trimmed = name?.trim() ?? '';

    if (trimmed.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres.');
    }

    if (trimmed.length > 60) {
        throw new Error('El nombre no puede exceder los 60 caracteres.');
    }
}

export function validateEmail(email: string): void {
    if (!EMAIL_REGEX.test(normalizeEmail(email))) {
        throw new Error('El correo no tiene un formato válido.');
    }
}

export function validatePassword(password: string): void {
    if (!password || password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        throw new Error('La contraseña debe incluir letras y números.');
    }
}
