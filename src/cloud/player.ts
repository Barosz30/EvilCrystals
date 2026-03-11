const PLAYER_ID_KEY = "demon_king_player_id";

export function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;

  const id = (globalThis.crypto && "randomUUID" in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : `player_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  localStorage.setItem(PLAYER_ID_KEY, id);
  return id;
}
