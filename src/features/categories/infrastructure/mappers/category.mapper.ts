import { Category } from '../../domain/entities/category';
import { CreateCategoryParams, UpdateCategoryParams } from '../../domain/repositories/category.repository';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

export class CategoryMapper {
    static toDomain(dto: CategoryResponseDto): Category {
        return new Category({ id: dto.id, name: dto.name, color: dto.color });
    }

    static toCreateDto(params: CreateCategoryParams): CreateCategoryDto {
        return { name: params.name.trim(), color: params.color };
    }

    static toUpdateDto(params: UpdateCategoryParams): UpdateCategoryDto {
        return { id: params.id, name: params.name.trim(), color: params.color };
    }
}
