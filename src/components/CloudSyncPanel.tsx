import { useEffect, useMemo, useState } from "react";
import type { GameState } from "../game/types";
import { getOrCreatePlayerId } from "../cloud/player";
import { health, saveToCloud, loadFromCloud, submitScore, getLeaderboard, type LeaderboardEntry } from "../cloud/api";
import { fromState, formatShort } from "../game/decimal";

interface CloudSyncPanelProps {
  state: GameState;
  onReplaceState: (newState: GameState) => void;
  onPersistLocal: (state: GameState) => void;
}

export function CloudSyncPanel({ state, onReplaceState, onPersistLocal }: CloudSyncPanelProps) {
  const playerId = useMemo(() => getOrCreatePlayerId(), []);

  const [online, setOnline] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const scoreNumber = useMemo(() => {
    // MVP score: totalGoldEarned clamped to a safe finite number
    const n = fromState(state.totalGoldEarned).toNumber();
    if (!isFinite(n) || n < 0) return 0;
    return Math.min(n, Number.MAX_SAFE_INTEGER);
  }, [state.totalGoldEarned]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await health();
      if (!cancelled) setOnline(ok);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshLeaderboard() {
    setBusy(true);
    setMsg("");
    try {
      const top = await getLeaderboard();
      setLeaderboard(top);
      setMsg("Pobrano leaderboard");
    } catch (e: any) {
      setMsg(e?.message ?? "Nie udało się pobrać leaderboardu");
    } finally {
      setBusy(false);
    }
  }

  async function doSave() {
    setBusy(true);
    setMsg("");
    try {
      await saveToCloud(playerId, state);
      await submitScore(playerId, scoreNumber);
      setMsg("Zapisano w chmurze i wysłano wynik");
      await refreshLeaderboard();
    } catch (e: any) {
      setMsg(e?.message ?? "Nie udało się zapisać w chmurze");
    } finally {
      setBusy(false);
    }
  }

  async function doLoad() {
    setBusy(true);
    setMsg("");
    try {
      const cloudState = await loadFromCloud(playerId);
      onReplaceState(cloudState);
      onPersistLocal(cloudState);
      setMsg("Wczytano zapis z chmury");
    } catch (e: any) {
      setMsg(e?.message ?? "Nie udało się wczytać z chmury");
    } finally {
      setBusy(false);
    }
  }

  const shortPlayerId = useMemo(
    () => `${playerId.slice(0, 4)}…${playerId.slice(-4)}`,
    [playerId]
  );

  return (
    <section className="card-fantasy bg-void-800/95 border-earth-700/50 p-4 mb-4" aria-label="Cloud Sync">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-forest-400 font-semibold text-lg">
            Pakt z chmurą
          </h2>
          <p className="text-xs text-amber-100/70 mt-1">
            Status:
            <span
              className={
                online
                  ? "ml-1 inline-flex items-center gap-1 text-forest-400"
                  : online === false
                    ? "ml-1 inline-flex items-center gap-1 text-red-400"
                    : "ml-1 inline-flex items-center gap-1 text-amber-100/50"
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {online === null ? "nawiązywanie rytuału..." : online ? "połączono" : "brak połączenia"}
            </span>
          </p>
          <p className="text-[11px] text-amber-100/50 mt-1">
            Profil demona: <span className="font-mono text-amber-100/80">{shortPlayerId}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={refreshLeaderboard}
          disabled={busy}
          className="shrink-0 px-3 py-2 rounded-lg font-display text-xs sm:text-sm bg-void-700 hover:bg-earth-700/60 disabled:bg-void-700/50 disabled:text-amber-100/40 disabled:cursor-not-allowed border border-earth-700/40"
        >
          Pokaż ranking
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={doSave}
          disabled={busy}
          className="w-full py-2 rounded-lg font-display text-sm bg-forest-600 hover:bg-forest-500 disabled:bg-void-600 disabled:text-amber-100/50 disabled:cursor-not-allowed text-white transition border border-forest-500/30"
        >
          Złóż mroczny zapis
        </button>
        <button
          type="button"
          onClick={doLoad}
          disabled={busy}
          className="w-full py-2 rounded-lg font-display text-sm bg-gold-600 hover:bg-gold-500 disabled:bg-void-600 disabled:text-amber-100/50 disabled:cursor-not-allowed text-void-900 transition border border-gold-500/30"
        >
          Przywołaj zapis z chmury
        </button>
      </div>

      <div className="mt-2 text-xs text-amber-100/70">
        Twój mroczny dorobek:{" "}
        <span className="text-gold-400">
          {formatShort(fromState(state.totalGoldEarned))} złota
        </span>
      </div>

      {msg && (
        <div className="mt-2 text-xs sm:text-sm text-amber-100/80">{msg}</div>
      )}

      {leaderboard.length > 0 && (
        <div className="mt-3">
          <h3 className="font-display text-amber-50 text-sm mb-2">
            Tablica chwały (Top 10)
          </h3>
          <ol className="space-y-1">
            {leaderboard.slice(0, 10).map((e) => (
              <li
                key={e.playerId}
                className="flex items-center justify-between text-[11px] sm:text-xs bg-void-700/80 rounded-md px-2 py-1 border border-earth-800/30"
              >
                <span className="text-amber-100/60 tabular-nums">#{e.rank}</span>
                <span className="text-amber-100/80 truncate mx-2">
                  {`${e.playerId.slice(0, 4)}…${e.playerId.slice(-4)}`}
                </span>
                <span className="text-gold-400 tabular-nums">
                  {Math.floor(e.score)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
