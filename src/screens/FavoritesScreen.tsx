import { Star } from 'lucide-react';
import PhraseCard from '../components/cards/PhraseCard';
import TopBar from '../components/layout/TopBar';
import { MOCK_PHRASES } from '../data/seed';

interface FavoritesScreenProps {
  favorites: ReadonlySet<string>;
  playingId: string | null;
  isFavorite: (id: string) => boolean;
  onPlay: (id: string, text: string) => void;
  onToggleFav: (id: string) => void;
}

export default function FavoritesScreen({
  favorites,
  playingId,
  isFavorite,
  onPlay,
  onToggleFav,
}: FavoritesScreenProps) {
  const favoritePhrases = MOCK_PHRASES.filter((p) => favorites.has(p.id));

  return (
    <div className="transition-opacity duration-300">
      <TopBar title="Mis Favoritos" />
      <div className="p-5 space-y-4">
        {favorites.size === 0 ? (
          <div className="text-center py-24 px-6">
            <Star
              className="w-16 h-16 text-slate-200 mx-auto mb-6"
              aria-hidden="true"
            />
            <p className="text-slate-500 font-medium text-xl">
              Aún no tienes frases favoritas.
            </p>
            <p className="text-slate-400 text-base mt-2">
              Marca la estrella en cualquier frase frecuente para guardarla
              aquí.
            </p>
          </div>
        ) : (
          favoritePhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              text={phrase.text}
              isPlaying={playingId === phrase.id}
              isFavorite={isFavorite(phrase.id)}
              onPlay={() => onPlay(phrase.id, phrase.text)}
              onToggleFav={() => onToggleFav(phrase.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
