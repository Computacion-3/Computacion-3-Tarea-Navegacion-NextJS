export interface RoutineProps {
    id: number;
    name: string;
    description: string;
}

export class Routine {
    readonly id: number;
    readonly name: string;
    readonly description: string;

    constructor(props: RoutineProps) {
        this.validate(props);
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
    }

    validate(props: RoutineProps) {
        if (props.name.length < 4) { // @Column({length: 10})
            throw new Error("Name should have a length greather than 10")
        }
    }
}