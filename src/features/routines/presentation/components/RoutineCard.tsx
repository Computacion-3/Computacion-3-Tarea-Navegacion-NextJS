import { CategoryBadge } from '@/src/features/categories/presentation/components/CategoryBadge';
import { CategoryItemViewModel } from '@/src/features/categories/presentation/viewmodels/category.viewmodel';
import { RoutineItemViewModel } from '../viewmodels/routine.viewmodel';

interface RoutineCardProps {
  routine: RoutineItemViewModel;
  // undefined si la categoría fue eliminada o aún no ha cargado
  category?: CategoryItemViewModel;
}

export function RoutineCard({ routine, category }: RoutineCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-neutral-900">{routine.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {routine.descriptionText}
        </p>
      </div>

      <div className="mt-auto">
        {category ? (
          <CategoryBadge name={category.name} color={category.color} />
        ) : (
          <CategoryBadge name="Sin categoría" color="#737373" />
        )}
      </div>
    </div>
  );
}
