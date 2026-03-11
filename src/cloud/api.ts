import type { GameState } from "../game/types";

const DEFAULT_API_BASE = "http://localhost:8787";

function apiBase(): string {
  // Vite env
  const fromEnv = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return (fromEnv && fromEnv.trim()) ? fromEnv.trim().replace(/\/$/, "") : DEFAULT_API_BASE;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function health(): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/health`, { method: "GET" });
    const data = await json<{ ok: boolean }>(res);
    return !!data.ok;
  } catch {
    return false;
  }
}

export async function saveToCloud(playerId: string, state: GameState): Promise<void> {
  const res = await fetch(`${apiBase()}/api/save`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ playerId, state })
  });
  await json(res);
}

export async function loadFromCloud(playerId: string): Promise<GameState> {
  const res = await fetch(`${apiBase()}/api/save/${encodeURIComponent(playerId)}`);
  const out = await json<{ ok: boolean; data: { state: GameState } }>(res);
  return out.data.state;
}

export async function submitScore(playerId: string, score: number): Promise<void> {
  const res = await fetch(`${apiBase()}/api/score`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ playerId, score })
  });
  await json(res);
}

export type LeaderboardEntry = { rank: number; playerId: string; score: number };

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${apiBase()}/api/leaderboard`);
  const out = await json<{ ok: boolean; top: LeaderboardEntry[] }>(res);
  return out.top;
}
