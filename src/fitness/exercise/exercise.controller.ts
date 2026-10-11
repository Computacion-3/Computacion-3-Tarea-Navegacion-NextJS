import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../../auth/guards/permissions/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercise')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_exercises')
    create(@Body() createExerciseDto: CreateExerciseDto) {
        return this.exerciseService.create(createExerciseDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('view_exercises')
    findAll() {
        return this.exerciseService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('view_exercises')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.exerciseService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_exercises')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
        return this.exerciseService.update(id, updateExerciseDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_exercises')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.exerciseService.remove(id);
    }
}
