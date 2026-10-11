import { Module } from '@nestjs/common';
import { ExerciseModule } from './exercise/exercise.module';
import { RoutineModule } from './routine/routine.module';

@Module({
    imports: [ExerciseModule, RoutineModule],
    exports: [ExerciseModule, RoutineModule],
})
export class FitnessModule {}
