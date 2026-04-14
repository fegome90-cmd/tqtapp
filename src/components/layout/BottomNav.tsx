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
    <div className="fixed bottom-3 left-3 right-3 z-50">
      <nav
        className="flex justify-around items-center px-1 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-white/50"
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
              className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all ${
                isActive
                  ? 'bg-primary-container text-white rounded-xl shadow-lg shadow-primary-container/20 active:scale-95'
                  : 'text-outline-variant hover:text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? '[stroke-width:2.5]' : ''}`}
                aria-hidden="true"
              />
              <span className="text-[9px] font-black uppercase mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
