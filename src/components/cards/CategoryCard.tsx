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
import type { CategoryId } from '../../types';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  categoryId: CategoryId;
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
  categoryId,
  onClick,
}: CategoryCardProps) {
  const IconComponent = iconMap[icon] || iconMap.Heart;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full p-5 bg-card rounded-[var(--radius-lg)] border-2 border-transparent hover:border-[var(--color-primary-action)] shadow-[var(--elevation-1)] active:scale-[var(--scale-press)] transition-all flex items-center gap-4 text-left"
    >
      <div
        className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center group-hover:scale-[var(--scale-hover)] transition-transform"
        style={{
          backgroundColor: `var(--cat-${categoryId}-bg)`,
          color: `var(--cat-${categoryId}-text)`,
        }}
      >
        <IconComponent className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[var(--text-lg)] font-[var(--weight-black)] text-heading truncate">
          {title}
        </h3>
        <p className="text-[var(--text-sm)] font-[var(--weight-medium)] text-secondary mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  );
}
