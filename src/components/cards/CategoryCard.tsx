import {
  AlertTriangle,
  Wind,
  Droplets,
  Activity,
  Move,
  Users,
  Coffee,
  Heart,
  Play,
  Star,
} from 'lucide-react';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  colorClasses: string;
  onClick: () => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  AlertTriangle,
  Wind,
  Droplets,
  Activity,
  Move,
  Users,
  Coffee,
  Heart,
  Play,
  Star,
};

export default function CategoryCard({
  icon,
  title,
  description,
  colorClasses,
  onClick,
}: CategoryCardProps) {
  const IconComponent = iconMap[icon] || iconMap.Heart;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 bg-white rounded-2xl border hover:bg-white/80 transition-all active:scale-[0.98] flex items-center gap-4 text-left ${colorClasses}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses}`}
      >
        <IconComponent className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-slate-800 truncate">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  );
}
