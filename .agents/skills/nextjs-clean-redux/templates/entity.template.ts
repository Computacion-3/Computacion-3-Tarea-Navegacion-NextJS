export interface {{EntityName}}Props {
    readonly id: number;
    readonly name: string;
    readonly description?: string;
    readonly createdAt: Date;
}

export class {{EntityName}} {
    readonly id: number;
    readonly name: string;
    readonly description?: string;
    readonly createdAt: Date;

    constructor(props: {{EntityName}}Props) {
        this.validate(props);
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.createdAt = props.createdAt;
    }

    private validate(props: {{EntityName}}Props): void {
        if (!props.name || props.name.trim().length < 3) {
            throw new Error('Name must have at least 3 characters.');
        }
        if (props.name.trim().length > 100) {
            throw new Error('Name cannot exceed 100 characters.');
        }
    }

    hasDescription(): boolean {
        return Boolean(this.description && this.description.trim().length > 0);
    }
}
