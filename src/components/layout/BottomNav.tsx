import { History, Home, MessageSquare, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type TabId = 'home' | 'talk' | 'history' | 'profile';

export interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'talk', label: 'Escribir', icon: MessageSquare },
  { id: 'history', label: 'Favoritos', icon: History },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <div
      className="fixed left-3 right-3 z-50"
      style={{ bottom: 'calc(var(--safe-bottom, 12px) + 12px)' }}
    >
      <nav
        className="flex justify-around items-center px-1 py-2 bg-[var(--glass-nav)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-pill)] border border-[var(--glass-border)] shadow-[var(--elevation-2)]"
        aria-label="Navegación principal"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-primary-action text-on-action rounded-[var(--radius-xl)] shadow-[var(--elevation-1)] shadow-[color:var(--color-primary-action)/20] active:scale-[var(--scale-press-sm)]'
                  : 'text-secondary hover:text-[var(--color-primary)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? '[stroke-width:2.5]' : ''}`}
                aria-hidden="true"
              />
              <span className="text-[var(--text-xs)] font-[var(--weight-black)] uppercase mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
