import PhraseCard from '../components/cards/PhraseCard';
import TopBar from '../components/layout/TopBar';
import { CATEGORIES, MOCK_PHRASES } from '../data/seed';
import type { CategoryId } from '../types';

interface CategoryDetailScreenProps {
  categoryId: CategoryId;
  playingId: string | null;
  isFavorite: (id: string) => boolean;
  onPlay: (id: string, text: string) => void;
  onToggleFav: (id: string) => void;
  onBack: () => void;
}

export default function CategoryDetailScreen({
  categoryId,
  playingId,
  isFavorite,
  onPlay,
  onToggleFav,
  onBack,
}: CategoryDetailScreenProps) {
  const categoryPhrases = MOCK_PHRASES.filter(
    (p) => p.categoryId === categoryId,
  );
  const categoryTitle =
    CATEGORIES.find((c) => c.id === categoryId)?.title || 'Frases';

  return (
    <div className="transition-all duration-300 transform translate-x-0">
      <TopBar title={categoryTitle} showBack onBack={onBack} />
      <div className="p-5 space-y-4">
        {categoryPhrases.map((phrase) => (
          <PhraseCard
            key={phrase.id}
            text={phrase.text}
            isPlaying={playingId === phrase.id}
            isFavorite={isFavorite(phrase.id)}
            onPlay={() => onPlay(phrase.id, phrase.text)}
            onToggleFav={() => onToggleFav(phrase.id)}
          />
        ))}
        {categoryPhrases.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <p className="text-lg font-medium">Categoría en construcción.</p>
          </div>
        )}
      </div>
    </div>
  );
}
