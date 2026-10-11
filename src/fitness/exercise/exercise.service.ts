import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExerciseNotFoundException } from '../../common/exceptions';
import { Exercise } from '../entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
    ) {}

    async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
        const exercise = this.exerciseRepository.create(createExerciseDto);
        return await this.exerciseRepository.save(exercise);
    }

    async findAll(): Promise<Exercise[]> {
        return await this.exerciseRepository.find();
    }

    async findOne(id: number): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findOne({ where: { id } });
        if (!exercise) {
            throw new ExerciseNotFoundException(id);
        }
        return exercise;
    }

    async update(id: number, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
        const exercise = await this.findOne(id);
        this.exerciseRepository.merge(exercise, updateExerciseDto);
        return await this.exerciseRepository.save(exercise);
    }

    async remove(id: number): Promise<{ message: string }> {
        const exercise = await this.findOne(id);
        await this.exerciseRepository.remove(exercise);
        return { message: `Exercise with id #${id} deleted successfully` };
    }
}
