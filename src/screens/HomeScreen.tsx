import CategoryCard from '../components/cards/CategoryCard';
import EmergencyCTA from '../components/cards/EmergencyCTA';
import TopBar from '../components/layout/TopBar';
import { CATEGORIES } from '../data/seed';
import type { CategoryId } from '../types';

interface HomeScreenProps {
  onCategorySelect: (categoryId: CategoryId) => void;
  onEmergency: () => void;
}

export default function HomeScreen({
  onCategorySelect,
  onEmergency,
}: HomeScreenProps) {
  return (
    <div className="transition-opacity duration-300">
      <TopBar title="Buen día, Paciente" />
      <div className="p-5 space-y-8">
        <div>
          <EmergencyCTA onClick={onEmergency} />
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-1">
            Categorías Frecuentes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => {
              return (
                <CategoryCard
                  key={cat.id}
                  icon={cat.icon}
                  title={cat.title}
                  description={cat.description || ''}
                  colorClasses={cat.color || ''}
                  onClick={() => onCategorySelect(cat.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
