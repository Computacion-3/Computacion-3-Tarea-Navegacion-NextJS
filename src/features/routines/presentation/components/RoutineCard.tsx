import { RoutineItemViewModel } from '../viewmodels/routine.viewmodel';

interface RoutineCardProps {
  routine: RoutineItemViewModel;
}

export function RoutineCard({ routine }: RoutineCardProps) {
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

        <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200 text-xs opacity-50">
          <span>Creado el {routine.formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
