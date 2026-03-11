/**
 * Konfiguracja sceny – profesjonalne animacje (Lottie / sprite sheet).
 *
 * Aby użyć animacji Lottie dla maga:
 * 1. Pobierz plik JSON z https://lottiefiles.com (np. wyszukaj "wizard idle", "magic").
 * 2. Wrzuć do public/animations/ (np. mage-idle.json).
 * 3. Ustaw mageAnimationUrl na '/animations/mage-idle.json' lub pełny URL.
 *
 * Zostaw null, aby używać domyślnego SVG maga.
 */
export const sceneConfig = {
  /** URL do pliku JSON animacji Lottie (mag) – null = domyślny SVG */
  mageAnimationUrl: null as string | null,

  /** Opcjonalnie: URL Lottie dla namiotu (np. delikatny ruch płótna) */
  tentAnimationUrl: null as string | null,
}
