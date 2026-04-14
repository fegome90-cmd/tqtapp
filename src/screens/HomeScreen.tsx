import CategoryCard from '../components/cards/CategoryCard';
import EmergencyCTA from '../components/cards/EmergencyCTA';
import TopBar from '../components/layout/TopBar';
import { CATEGORIES } from '../data/seed';
import type { CategoryId } from '../types';

interface HomeScreenProps {
  onCategorySelect: (categoryId: CategoryId) => void;
  onEmergency: () => void;
}

const categoryColors: Record<string, string> = {
  urgente: 'bg-red-50 text-red-600 border-red-200',
  respiracion: 'bg-blue-50 text-blue-600 border-blue-200',
  secreciones: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  dolor: 'bg-orange-50 text-orange-600 border-orange-200',
  posicion: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  familia: 'bg-purple-50 text-purple-600 border-purple-200',
  necesidades: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  emociones: 'bg-pink-50 text-pink-600 border-pink-200',
  gratitud: 'bg-amber-50 text-amber-600 border-amber-200',
};

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
              const colorClass =
                categoryColors[cat.id] || categoryColors.necesidades;
              const [bgColor, textColor] = colorClass.split(' ');
              return (
                <CategoryCard
                  key={cat.id}
                  icon={cat.icon}
                  title={cat.title}
                  description={cat.description || ''}
                  iconBgColor={bgColor}
                  iconColor={textColor}
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
