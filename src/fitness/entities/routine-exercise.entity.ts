import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Routine } from './routine.entity';
import { Exercise } from './exercise.entity';

@Entity('routine_exercises')
export class RoutineExercise {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'routine_id' })
    routine: Routine;

    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises, {
        eager: true,
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ type: 'int', default: 0, name: 'order_index' })
    orderIndex: number;

    @Column({ type: 'int', nullable: true, name: 'target_sets' })
    targetSets?: number;

    @Column({ type: 'int', nullable: true, name: 'target_reps' })
    targetReps?: number;

    @Column({ type: 'float', nullable: true, name: 'target_weight_kg' })
    targetWeightKg?: number;

    @Column({ type: 'int', nullable: true, name: 'target_duration_min' })
    targetDurationMin?: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
