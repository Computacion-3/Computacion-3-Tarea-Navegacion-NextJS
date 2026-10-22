import { RoutineItemViewModel } from '../viewmodels/routine.viewmodel';

interface RoutineCardProps {
  routine: RoutineItemViewModel;
  onEdit?: (routine: RoutineItemViewModel) => void;
  onDelete?: (id: number) => void;
  disabled?: boolean;
}

export function RoutineCard({
  routine,
  onEdit,
  onDelete,
  disabled = false,
}: RoutineCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="card-title text-base">{routine.title}</h3>
            <p className="text-sm opacity-70 mt-1">{routine.descriptionText}</p>
          </div>
          <span
            className={`badge ${
              routine.isRecent ? 'badge-accent' : 'badge-primary badge-outline'
            }`}
          >
            {routine.badgeText}
          </span>
        </div>

        <div className="card-actions justify-between items-center mt-3 pt-3 border-t border-base-200 text-xs">
          <span className="opacity-50">Creado el {routine.formattedDate}</span>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(routine)}
                  disabled={disabled}
                  className="btn btn-outline btn-xs btn-neutral"
                  aria-label={`Editar rutina ${routine.title}`}
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(routine.id)}
                  disabled={disabled}
                  className="btn btn-outline btn-xs btn-error"
                  aria-label={`Eliminar rutina ${routine.title}`}
                >
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
