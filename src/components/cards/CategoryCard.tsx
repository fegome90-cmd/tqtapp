import {
  Activity,
  AlertTriangle,
  Coffee,
  Droplets,
  Heart,
  Move,
  Play,
  Star,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
  onClick: () => void;
}

const iconMap: Record<string, LucideIcon> = {
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
  iconBgColor,
  iconColor,
  onClick,
}: CategoryCardProps) {
  const IconComponent = iconMap[icon] ?? Heart;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-4 bg-white rounded-2xl border border-slate-200/60 hover:border-slate-300 hover:bg-white/80 transition-colors active:scale-[0.98] flex items-center gap-4 text-left"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgColor} ${iconColor}`}
      >
        <IconComponent className="w-7 h-7" aria-hidden="true" />
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
