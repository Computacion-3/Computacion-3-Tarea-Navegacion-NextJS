import { Routine } from '../../domain/entities/routine';

interface RoutineCardProps {
    routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
    const formattedDate = routine.createdAt.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="card-title text-base">{routine.name}</h3>
                        <p className="text-sm opacity-70 mt-1">
                            {routine.hasDescription() ? routine.description : 'Sin descripción asignada.'}
                        </p>
                    </div>
                    <span className="badge badge-primary badge-outline">
                        ID #{routine.id}
                    </span>
                </div>

                <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200 text-xs opacity-50">
                    <span>Creado el {formattedDate}</span>
                </div>
            </div>
        </div>
    );
}
