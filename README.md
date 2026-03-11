# Demon King Idle

Gra idle w przeglądarce i na telefonie (PWA). Jako zły czarnoksiężnik zbierasz złą energię, przywołujesz stwory, rajdujesz ludzkość po złoto i ulepszenia.

## Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS
- **Duże liczby:** break_eternity.js
- **Zapis:** localStorage (offline progress, zapis co ~30 s)
- **PWA:** vite-plugin-pwa (manifest + service worker)

## Uruchomienie

```bash
npm install
npm run dev
```

Build pod produkcję:

```bash
npm run build
npm run preview
```

## Zasady gry

1. **Zła energia** – rośnie w czasie z produkcji przywołanych stworów.
2. **Stwory** – kupuj za energię (Imp → Mniejszy demon → Demon → Większy demon → Arcydemon). Każdy typ daje produkcję energii/s i siłę do raidu.
3. **Raid** – gdy masz armię, rozpocznij raid (30 s). Dostaniesz złoto, stracisz część armii.
4. **Złoto** – wydawaj na ulepszenia (+% produkcji, +% siły, +% złota z rajdów).
5. **Offline** – do 24 h postępu liczone przy powrocie do gry.

## Dalsze fazy (z planu)

- Faza 2: Backend, konta, zapis w chmurze
- Faza 3: Rankingi, sezony/zawody
- Faza 4: Mikropłatności (Stripe)
