import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoutineExercise } from './routine-exercise.entity';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 50, nullable: true })
    type?: string;

    @Column({ type: 'float', nullable: true, name: 'estimated_calories' })
    estimatedCalories?: number;

    @Column({ type: 'float', nullable: true, name: 'estimated_distance_km' })
    estimatedDistanceKm?: number;

    @Column({ type: 'int', nullable: true, name: 'estimated_duration_min' })
    estimatedDurationMin?: number;

    @Column({ length: 255, nullable: true })
    icon?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises: RoutineExercise[];
}
