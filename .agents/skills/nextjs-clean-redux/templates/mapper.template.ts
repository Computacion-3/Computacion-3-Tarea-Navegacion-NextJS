import { {{EntityName}} } from '../../domain/entities/{{entity-slug}}';
import { Create{{EntityName}}Params } from '../../domain/repositories/{{entity-slug}}.repository';
import { {{EntityName}}ResponseDto, Create{{EntityName}}Dto } from '../dtos/{{entity-slug}}.dto';

export class {{EntityName}}Mapper {
    static toDomain(dto: {{EntityName}}ResponseDto): {{EntityName}} {
        return new {{EntityName}}({
            id: dto.id,
            name: dto.name,
            description: dto.description ?? undefined,
            createdAt: new Date(dto.created_at),
        });
    }

    static toDto(params: Create{{EntityName}}Params): Create{{EntityName}}Dto {
        return {
            name: params.name.trim(),
            description: params.description?.trim(),
        };
    }
}
