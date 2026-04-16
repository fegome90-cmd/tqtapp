import { useState, useCallback } from 'react';

type ScreenId =
  | 'home'
  | 'category-detail'
  | 'favorites'
  | 'free-text'
  | 'profile'
  | 'preop-voice-bank';

interface NavigationState {
  currentScreen: ScreenId;
  canGoBack: boolean;
  navigationParams: Record<string, string>;
}

export function useNavigation() {
  const [history, setHistory] = useState<NavigationState[]>([
    { currentScreen: 'home', canGoBack: false, navigationParams: {} },
  ]);

  const current = history[history.length - 1];

  const navigate = useCallback(
    (screenId: ScreenId, params?: Record<string, string>) => {
      setHistory((prev) => [
        ...prev,
        {
          currentScreen: screenId,
          canGoBack: true,
          navigationParams: params ?? {},
        },
      ]);
    },
    [],
  );

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const resetTo = useCallback((screenId: ScreenId) => {
    setHistory([
      { currentScreen: screenId, canGoBack: false, navigationParams: {} },
    ]);
  }, []);

  return {
    currentScreen: current.currentScreen,
    canGoBack: current.canGoBack,
    navigationParams: current.navigationParams,
    navigate,
    goBack,
    resetTo,
  };
}
