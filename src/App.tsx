import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import BottomNav from './components/layout/BottomNav';
import type { TabId } from './components/layout/BottomNav';
import { useTTS } from './lib/tts/TTSContext';
import { TTSSpeakerProvider } from './lib/tts/TTSContext';
import { PatientProvider } from './hooks/usePatient';
import { useFavorites } from './hooks/useFavorites';
import { useNavigation } from './hooks/useNavigation';
import HomeScreen from './screens/HomeScreen';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import PreopVoiceBankScreen from './screens/PreopVoiceBankScreen';
import type { CategoryId } from './types';

export function MainApp() {
  const { currentScreen, navigate, goBack, resetTo, navigationParams } =
    useNavigation();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const { speak, isSpeaking } = useTTS();
  const [announcement, setAnnouncement] = useState('');
  const prevSpeakingRef = useRef(false);

  useEffect(() => {
    if (isSpeaking && !prevSpeakingRef.current) {
      setAnnouncement('Reproduciendo...');
    } else if (!isSpeaking && prevSpeakingRef.current) {
      setAnnouncement('Frase completada');
    }
    prevSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const handlePlay = async (id: string, phraseText?: string) => {
    setPlayingId(id);
    setTtsError(null);
    try {
      await speak(phraseText || 'Necesito ayuda');
    } catch {
      setTtsError('No se pudo reproducir la frase.');
    } finally {
      setPlayingId(null);
    }
  };

  const handleEmergency = () =>
    handlePlay('urgency_main', 'Necesito ayuda urgente');

  const handleCategorySelect = (categoryId: CategoryId) =>
    navigate('category-detail', { categoryId });

  const handleTabChange = (tab: TabId) => {
    const screenMap: Record<
      TabId,
      'home' | 'free-text' | 'favorites' | 'profile'
    > = {
      home: 'home',
      talk: 'free-text',
      history: 'favorites',
      profile: 'profile',
    };
    resetTo(screenMap[tab]);
  };

  const bottomNavTab: TabId =
    currentScreen === 'favorites'
      ? 'history'
      : currentScreen === 'free-text'
        ? 'talk'
        : currentScreen === 'profile'
          ? 'profile'
          : 'home';

  return (
    <div className="w-full max-w-2xl mx-auto min-h-dvh sm:min-h-[95vh] sm:mt-[2.5vh] sm:rounded-[2.5rem] bg-slate-50 flex flex-col font-sans relative sm:shadow-2xl overflow-hidden sm:border-[3px] sm:border-slate-300">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      {ttsError && (
        <div
          role="alert"
          className="mx-4 mt-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between"
        >
          <span>{ttsError}</span>
          <button
            type="button"
            onClick={() => setTtsError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
            aria-label="Cerrar error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {currentScreen === 'home' && (
          <HomeScreen
            onCategorySelect={handleCategorySelect}
            onEmergency={handleEmergency}
          />
        )}
        {currentScreen === 'category-detail' && (
          <CategoryDetailScreen
            categoryId={navigationParams.categoryId as CategoryId}
            playingId={playingId}
            isFavorite={isFavorite}
            onPlay={handlePlay}
            onToggleFav={toggleFavorite}
            onBack={goBack}
          />
        )}
        {currentScreen === 'free-text' && (
          <FreeTextScreen onPlay={handlePlay} />
        )}
        {currentScreen === 'favorites' && (
          <FavoritesScreen
            favorites={favorites}
            playingId={playingId}
            isFavorite={isFavorite}
            onPlay={handlePlay}
            onToggleFav={toggleFavorite}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen
            onNavigateVoiceBank={() => navigate('preop-voice-bank')}
          />
        )}
        {currentScreen === 'preop-voice-bank' && (
          <PreopVoiceBankScreen onBack={goBack} />
        )}
      </main>
      <BottomNav currentTab={bottomNavTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <PatientProvider>
      <TTSSpeakerProvider>
        <MainApp />
      </TTSSpeakerProvider>
    </PatientProvider>
  );
}
