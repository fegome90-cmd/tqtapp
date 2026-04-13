import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  Coffee,
  Droplets,
  Heart,
  Home,
  MessageSquare,
  Mic,
  Move,
  Play,
  Star,
  User,
  Users,
  Volume2,
  Wind,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { CATEGORIES, MOCK_PHRASES } from './data/mock';
import { cn } from './lib/utils';
import type { CategoryId } from './types';

// Diccionario para mapear iconos desde strings de manera dinámica
const Icons: Record<string, React.FC<unknown>> = {
  AlertTriangle,
  Wind,
  Droplets,
  Activity,
  Move,
  Users,
  Coffee,
  Heart,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'talk' | 'favs' | 'profile'
  >('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [favorites, setFavorites] = useState<string[]>([
    'p1',
    'p16',
    'p17',
    'p18',
  ]); // Default favs
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');

  const handlePlay = (id: string) => {
    setPlayingId(id);
    // Mock duracion de audio
    setTimeout(() => setPlayingId(null), 1200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  // Componente Header local para reuso visual
  const TopBar = ({
    title,
    showBack,
  }: {
    title: string;
    showBack?: boolean;
  }) => (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="w-7 h-7 text-slate-700" />
          </button>
        )}
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
        <Volume2 className="w-5 h-5 text-slate-400" />
      </div>
    </header>
  );

  return (
    <div className="w-full max-w-2xl mx-auto h-screen sm:h-[95vh] sm:mt-[2.5vh] sm:rounded-[2.5rem] bg-slate-50 flex flex-col font-sans relative sm:shadow-2xl overflow-hidden sm:border-[8px] sm:border-slate-800">
      {/* ZONA PRINCIPAL DE CONTENIDO SCROLLABLE */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {/* 1. VISTA DASHBOARD (HOME) */}
        {currentTab === 'home' && !activeCategory && (
          <div className="transition-opacity duration-300">
            <TopBar title="Buen día, Paciente" />
            <div className="p-5 space-y-6">
              {/* Botón Principal de Emergencia */}
              <button
                type="button"
                onClick={() => handlePlay('urgency_main')}
                className={cn(
                  'w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all text-white rounded-3xl p-6 shadow-md shadow-red-600/20 flex items-center justify-between border-2 border-red-500',
                  playingId === 'urgency_main' && 'animate-pulse bg-red-500',
                )}
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-10 h-10" />
                  <span className="text-2xl font-bold tracking-wide uppercase">
                    Necesito Ayuda
                  </span>
                </div>
                <Play className="w-8 h-8 fill-white" />
              </button>

              {/* Grilla de Categorías */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Categorías Frecuentes
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map((cat) => {
                    const IconComponent = Icons[cat.icon] || Heart;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-start gap-4 text-left"
                      >
                        <div className={cn('p-4 rounded-2xl', cat.color)}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <span className="text-lg font-semibold text-slate-800">
                          {cat.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VISTA DETALLE DE CATEGORÍA */}
        {activeCategory && currentTab === 'home' && (
          <div className="transition-all duration-300 transform translate-x-0">
            <TopBar
              title={
                CATEGORIES.find((c) => c.id === activeCategory)?.title ||
                'Frases'
              }
              showBack
            />
            <div className="p-5 space-y-4">
              {MOCK_PHRASES.filter((p) => p.categoryId === activeCategory).map(
                (phrase) => (
                  <div
                    key={phrase.id}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex items-stretch min-h-[90px]"
                  >
                    <button
                      type="button"
                      onClick={() => handlePlay(phrase.id)}
                      className="flex-1 p-6 text-left active:bg-slate-50 transition-colors flex items-center gap-5"
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full transition-all duration-300',
                          playingId === phrase.id
                            ? 'bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                            : 'bg-slate-200',
                        )}
                      />
                      <span className="text-xl font-medium text-slate-800 leading-tight">
                        {phrase.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(phrase.id)}
                      className="px-6 border-l border-slate-100 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      <Star
                        className={cn(
                          'w-8 h-8 transition-all',
                          favorites.includes(phrase.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300',
                        )}
                      />
                    </button>
                  </div>
                ),
              )}
              {MOCK_PHRASES.filter((p) => p.categoryId === activeCategory)
                .length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  <p className="text-lg font-medium">
                    Categoría en construcción.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. VISTA TEXTO LIBRE (TECLADO LÓGICO) */}
        {currentTab === 'talk' && (
          <div className="h-full flex flex-col transition-opacity duration-300">
            <TopBar title="Texto Libre" />
            <div className="p-5 flex-1 flex flex-col gap-5">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex-1 relative flex flex-col min-h-[250px]">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  className="w-full flex-1 resize-none outline-none text-3xl font-medium text-slate-800 placeholder:text-slate-300 bg-transparent"
                  placeholder="Toca para escribir..."
                />
                {/* Predicciones mockeadas */}
                <div className="flex gap-3 overflow-x-auto pb-2 pt-4 no-scrollbar border-t border-slate-50">
                  {['Sí', 'No', 'Gracias', 'Por favor', 'Me duele'].map(
                    (sug) => (
                      <button
                        type="button"
                        key={sug}
                        onClick={() =>
                          setFreeText((prev) => (prev ? `${prev} ${sug}` : sug))
                        }
                        className="whitespace-nowrap px-6 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-full font-medium text-lg transition-colors"
                      >
                        {sug}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePlay('free_text')}
                disabled={!freeText.trim()}
                className="w-full bg-slate-900 disabled:bg-slate-300 disabled:scale-100 text-white rounded-3xl p-5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <Play className="w-6 h-6 fill-white" />
                <span className="text-xl font-semibold tracking-wide">
                  Reproducir Mensaje
                </span>
              </button>

              {/* Alerta de Módulo Futuro */}
              <div className="mt-2 p-5 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 flex items-center gap-4 opacity-80">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Mic className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    Dictado por voz y clonación
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    El input predictivo de audio está agendado para la Fase 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VISTA FAVORITOS */}
        {currentTab === 'favs' && (
          <div className="transition-opacity duration-300">
            <TopBar title="Mis Favoritos" />
            <div className="p-5 space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-24 px-6">
                  <Star className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-500 font-medium text-xl">
                    Aún no tienes frases favoritas.
                  </p>
                  <p className="text-slate-400 text-base mt-2">
                    Marca la estrella en cualquier frase frecuente para
                    guardarla aquí.
                  </p>
                </div>
              ) : (
                MOCK_PHRASES.filter((p) => favorites.includes(p.id)).map(
                  (phrase) => (
                    <div
                      key={phrase.id}
                      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex items-stretch min-h-[90px]"
                    >
                      <button
                        type="button"
                        onClick={() => handlePlay(phrase.id)}
                        className="flex-1 p-6 text-left active:bg-slate-50 flex items-center gap-5 transition-colors"
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full transition-all',
                            playingId === phrase.id
                              ? 'bg-blue-500 scale-125'
                              : 'bg-slate-200',
                          )}
                        />
                        <span className="text-xl font-medium text-slate-800">
                          {phrase.text}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(phrase.id)}
                        className="px-6 border-l border-slate-100 flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors"
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        )}

        {/* 5. VISTA PERFIL / AJUSTES / PRE-OP */}
        {currentTab === 'profile' && (
          <div className="transition-opacity duration-300">
            <TopBar title="Mi Perfil Clínico" />
            <div className="p-5 space-y-8">
              {/* Resumen Paciente */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-bold text-white">MR</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Mario Rojas
                  </h2>
                  <span className="inline-block mt-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                    Fase Preoperatoria
                  </span>
                </div>
              </div>

              {/* Ajustes visuales simples */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-2">
                  Accesibilidad
                </h3>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                  <div className="p-5 flex items-center justify-between active:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4 text-slate-800">
                      <Volume2 className="w-6 h-6" />
                      <span className="font-semibold text-lg">
                        Volumen de Voz
                      </span>
                    </div>
                    <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center px-1 justify-end">
                      <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Módulo Banco de Voz (Placeholder Visual) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-2">
                  Preparación Quirúrgica
                </h3>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-7 rounded-[2rem] shadow-lg relative overflow-hidden">
                  {/* Adornos visuales */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl" />
                  <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-2xl" />

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20">
                      <Mic className="w-7 h-7" />
                    </div>
                    <span className="px-4 py-1.5 bg-white text-indigo-800 text-sm font-bold rounded-full shadow-sm">
                      Progreso: 12 / 50 frases
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-2 relative z-10">
                    Mi Banco de Voz
                  </h4>
                  <p className="text-base text-blue-100 mb-6 relative z-10 leading-relaxed">
                    Graba tu voz antes de la laringectomía para que podamos
                    sintetizarla y la app suene exactamente como tú en el
                    futuro.
                  </p>

                  <button
                    type="button"
                    className="w-full bg-white text-indigo-700 font-bold text-lg py-4 rounded-2xl shadow-sm hover:bg-blue-50 active:scale-[0.98] transition-all relative z-10"
                  >
                    Continuar Grabando
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* NAVEGACIÓN INFERIOR PERSISTENTE (BOTTOM TABS) */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 pb-safe flex justify-between items-center shadow-[0_-15px_40px_rgba(0,0,0,0.04)] z-50">
        {[
          { id: 'home', icon: Home, label: 'Inicio' },
          { id: 'talk', icon: MessageSquare, label: 'Escribir' },
          { id: 'favs', icon: Star, label: 'Favoritos' },
          { id: 'profile', icon: User, label: 'Perfil' },
        ].map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              setCurrentTab(item.id as 'home' | 'talk' | 'favs' | 'profile');
              if (item.id === 'home') setActiveCategory(null);
            }}
            className="flex flex-col items-center gap-2 min-w-[72px] p-2"
          >
            <item.icon
              className={cn(
                'w-7 h-7 transition-all duration-300',
                currentTab === item.id
                  ? 'text-blue-600 scale-110'
                  : 'text-slate-400',
              )}
            />
            <span
              className={cn(
                'text-[11px] font-bold tracking-wide transition-colors uppercase',
                currentTab === item.id ? 'text-blue-600' : 'text-slate-400',
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
