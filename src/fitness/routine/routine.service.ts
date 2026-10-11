import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExerciseNotFoundException, RoutineNotFoundException, UserNotFoundException } from '../../common/exceptions';
import { User } from '../../auth/entities/user.entity';
import { Exercise } from '../entities/exercise.entity';
import { Routine } from '../entities/routine.entity';
import { RoutineExercise } from '../entities/routine-exercise.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutineService {
    constructor(
        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,
        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createRoutineDto: CreateRoutineDto, authenticatedUser?: User): Promise<Routine> {
        const targetUserId = createRoutineDto.userId ?? authenticatedUser?.id;
        if (!targetUserId) {
            throw new UserNotFoundException(0);
        }

        const user = await this.userRepository.findOne({ where: { id: targetUserId } });
        if (!user) {
            throw new UserNotFoundException(targetUserId);
        }

        const routine = this.routineRepository.create({
            name: createRoutineDto.name,
            description: createRoutineDto.description,
            user,
        });

        const savedRoutine = await this.routineRepository.save(routine);

        if (createRoutineDto.exercises && createRoutineDto.exercises.length > 0) {
            const routineExercises: RoutineExercise[] = [];
            for (let i = 0; i < createRoutineDto.exercises.length; i++) {
                const item = createRoutineDto.exercises[i];
                const exercise = await this.exerciseRepository.findOne({ where: { id: item.exerciseId } });
                if (!exercise) {
                    throw new ExerciseNotFoundException(item.exerciseId);
                }

                const routineExercise = this.routineExerciseRepository.create({
                    routine: savedRoutine,
                    exercise,
                    orderIndex: item.orderIndex ?? i,
                    targetSets: item.targetSets,
                    targetReps: item.targetReps,
                    targetWeightKg: item.targetWeightKg,
                    targetDurationMin: item.targetDurationMin,
                });
                routineExercises.push(routineExercise);
            }
            await this.routineExerciseRepository.save(routineExercises);
        }

        return await this.findOne(savedRoutine.id);
    }

    async findAll(): Promise<Routine[]> {
        return await this.routineRepository.find({
            relations: {
                user: true,
                routineExercises: {
                    exercise: true,
                },
            },
            order: {
                createdAt: 'DESC',
                routineExercises: {
                    orderIndex: 'ASC',
                },
            },
        });
    }

    async findOne(id: number): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            relations: {
                user: true,
                routineExercises: {
                    exercise: true,
                },
            },
            order: {
                routineExercises: {
                    orderIndex: 'ASC',
                },
            },
        });

        if (!routine) {
            throw new RoutineNotFoundException(id);
        }
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
        const routine = await this.findOne(id);

        if (updateRoutineDto.userId !== undefined) {
            const user = await this.userRepository.findOne({ where: { id: updateRoutineDto.userId } });
            if (!user) {
                throw new UserNotFoundException(updateRoutineDto.userId);
            }
            routine.user = user;
        }

        if (updateRoutineDto.name !== undefined) {
            routine.name = updateRoutineDto.name;
        }

        if (updateRoutineDto.description !== undefined) {
            routine.description = updateRoutineDto.description;
        }

        await this.routineRepository.save(routine);

        if (updateRoutineDto.exercises !== undefined) {
            await this.routineExerciseRepository.delete({ routine: { id } });

            const newRoutineExercises: RoutineExercise[] = [];
            for (let i = 0; i < updateRoutineDto.exercises.length; i++) {
                const item = updateRoutineDto.exercises[i];
                const exercise = await this.exerciseRepository.findOne({ where: { id: item.exerciseId } });
                if (!exercise) {
                    throw new ExerciseNotFoundException(item.exerciseId);
                }

                const routineExercise = this.routineExerciseRepository.create({
                    routine,
                    exercise,
                    orderIndex: item.orderIndex ?? i,
                    targetSets: item.targetSets,
                    targetReps: item.targetReps,
                    targetWeightKg: item.targetWeightKg,
                    targetDurationMin: item.targetDurationMin,
                });
                newRoutineExercises.push(routineExercise);
            }
            if (newRoutineExercises.length > 0) {
                await this.routineExerciseRepository.save(newRoutineExercises);
            }
        }

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string }> {
        const routine = await this.findOne(id);
        await this.routineRepository.remove(routine);
        return { message: `Routine with id #${id} deleted successfully` };
    }
}
