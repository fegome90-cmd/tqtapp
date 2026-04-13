import { Mic, Play, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';
import CategoryCard from './components/cards/CategoryCard';
import EmergencyCTA from './components/cards/EmergencyCTA';
import PhraseCard from './components/cards/PhraseCard';
import BottomNav from './components/layout/BottomNav';
import type { TabId } from './components/layout/BottomNav';
import TopBar from './components/layout/TopBar';
import { CATEGORIES, MOCK_PHRASES } from './data/mock';
import { TTSSpeakerProvider, useTTS } from './lib/tts/TTSContext';
import type { CategoryId } from './types';

// Mapeo de colores para categorías (propiedades separadas en lugar de string dividible)
const categoryColors: Record<string, { iconBg: string; iconText: string }> = {
  urgente: { iconBg: 'bg-red-50', iconText: 'text-red-600' },
  respiracion: { iconBg: 'bg-blue-50', iconText: 'text-blue-600' },
  secreciones: { iconBg: 'bg-cyan-50', iconText: 'text-cyan-600' },
  dolor: { iconBg: 'bg-orange-50', iconText: 'text-orange-600' },
  posicion: { iconBg: 'bg-indigo-50', iconText: 'text-indigo-600' },
  familia: { iconBg: 'bg-purple-50', iconText: 'text-purple-600' },
  necesidades: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  emociones: { iconBg: 'bg-pink-50', iconText: 'text-pink-600' },
};

function MainApp() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [favorites, setFavorites] = useState<string[]>([
    'p1',
    'p16',
    'p17',
    'p18',
  ]); // Default favs
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');

  // Hook TTS para síntesis de voz
  const { speak, isSpeaking } = useTTS();

  const handlePlay = (id: string, phraseText?: string) => {
    setPlayingId(id);
    speak(phraseText || 'Necesito ayuda')
      .catch(() => {
        // Silently handle TTS errors
      })
      .finally(() => setPlayingId(null));
  };

  const handleEmergency = () => {
    handlePlay('urgency_main', 'Necesito ayuda urgente');
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const handleTabChange = (tab: TabId) => {
    setCurrentTab(tab);
    if (tab === 'home') setActiveCategory(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-screen sm:h-[95vh] sm:mt-[2.5vh] sm:rounded-[2.5rem] bg-slate-50 flex flex-col font-sans relative sm:shadow-2xl overflow-hidden sm:border-[3px] sm:border-slate-300">
      {/* ZONA PRINCIPAL DE CONTENIDO SCROLLABLE */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {/* 1. VISTA DASHBOARD (HOME) */}
        {currentTab === 'home' && !activeCategory && (
          <div className="transition-opacity duration-300">
            <TopBar title="Buen día, Paciente" />
            <div className="p-5 space-y-8">
              {/* Botón Principal de Emergencia */}
              <div>
                <EmergencyCTA onClick={handleEmergency} isPlaying={playingId === 'urgency_main'} />
              </div>

              {/* Grilla de Categorías usando CategoryCard */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Categorías Frecuentes
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map((cat) => {
                    const colors =
                      categoryColors[cat.id] ?? categoryColors.necesidades;
                    return (
                      <CategoryCard
                        key={cat.id}
                        icon={cat.icon}
                        title={cat.title}
                        description={cat.description}
                        iconBgColor={colors.iconBg}
                        iconColor={colors.iconText}
                        onClick={() => setActiveCategory(cat.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VISTA DETALLE DE CATEGORÍA */}
        {activeCategory && currentTab === 'home' && (
          <div className="transition-opacity duration-300">
            <TopBar
              title={
                CATEGORIES.find((c) => c.id === activeCategory)?.title ||
                'Frases'
              }
              showBack
              onBack={() => setActiveCategory(null)}
            />
            <div className="p-5 space-y-4">
              {MOCK_PHRASES.filter((p) => p.categoryId === activeCategory).map(
                (phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    text={phrase.text}
                    isPlaying={playingId === phrase.id}
                    isFavorite={favorites.includes(phrase.id)}
                    onPlay={() => handlePlay(phrase.id, phrase.text)}
                    onToggleFav={() => toggleFavorite(phrase.id)}
                  />
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
              <div className="bg-white rounded-3xl border border-slate-200/60 p-5 flex-1 relative flex flex-col min-h-[250px]">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  className="w-full flex-1 resize-none outline-none text-3xl font-medium text-slate-800 placeholder:text-slate-300 bg-transparent"
                  placeholder="Toca para escribir…"
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
                onClick={() => handlePlay('free_text', freeText)}
                disabled={!freeText.trim() || isSpeaking}
                className="w-full bg-slate-900 disabled:bg-slate-300 disabled:scale-100 text-white rounded-3xl p-5 flex items-center justify-center gap-3 active:scale-[0.98] transition-colors"
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
                  <Star
                    className="w-16 h-16 text-slate-200 mx-auto mb-6"
                    aria-hidden="true"
                  />
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
                    <PhraseCard
                      key={phrase.id}
                      text={phrase.text}
                      isPlaying={playingId === phrase.id}
                      isFavorite={favorites.includes(phrase.id)}
                      onPlay={() => handlePlay(phrase.id, phrase.text)}
                      onToggleFav={() => toggleFavorite(phrase.id)}
                    />
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
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
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
                <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden divide-y divide-slate-100">
                  <div className="p-5 flex items-center justify-between active:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4 text-slate-800">
                      <Volume2 className="w-6 h-6" aria-hidden="true" />
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
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-7 rounded-[2rem] shadow-md relative overflow-hidden">
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
                    className="w-full bg-white text-indigo-700 font-bold text-lg py-4 rounded-2xl shadow-sm hover:bg-blue-50 active:scale-[0.98] transition-colors relative z-10"
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
      <BottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

// Componente wrapper que envuelve la app con el Provider TTS
export default function App({
  ttsProvider,
}: { ttsProvider?: import('./lib/tts/ports/TTSPort').TTSProvider } = {}) {
  return (
    <TTSSpeakerProvider provider={ttsProvider}>
      <MainApp />
    </TTSSpeakerProvider>
  );
}
