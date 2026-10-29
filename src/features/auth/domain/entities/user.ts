import { normalizeEmail, validateEmail, validateFullName } from './credentials';

export interface UserProps {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly createdAt: Date;
}

/**
 * Usuario autenticado. Nunca contiene la contraseña:
 * esa solo viaja en los parámetros de registro/login.
 */
export class User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly createdAt: Date;

    constructor(props: UserProps) {
        validateFullName(props.name);
        validateEmail(props.email);

        this.id = props.id;
        this.name = props.name.trim();
        this.email = normalizeEmail(props.email);
        this.createdAt = props.createdAt;
    }
}
