/** Public Xvohsome artist on Spotify — used when no env override is set. */
export const DEFAULT_XVOHSOME_SPOTIFY_URL =
  "https://open.spotify.com/artist/6pYTxnfVBk8z37q4tCeSBl";

/**
 * Paste any Spotify open URL or embed URL for your Xvohsome playlist / album / artist.
 * Override in `.env.local`:
 *   NEXT_PUBLIC_SPOTIFY_EMBED_SRC=https://open.spotify.com/playlist/YOUR_PLAYLIST_ID
 */
export function toSpotifyEmbedUrl(input: string): string {
  const t = input.trim();
  if (!t) return "";

  if (t.includes("/embed/")) {
    const base = t.split("?")[0];
    return base.startsWith("http") ? base : `https://open.spotify.com${base}`;
  }

  try {
    const u = new URL(t);
    if (u.hostname !== "open.spotify.com" && u.hostname !== "www.spotify.com") {
      return t;
    }
    const path = u.pathname.replace(/^\//, "");
    if (path.startsWith("embed/")) {
      return `https://open.spotify.com/${path}`;
    }
    return `https://open.spotify.com/embed/${path}`;
  } catch {
    return t;
  }
}

export function getSpotifyEmbedSrc(): string {
  const raw =
    process.env.NEXT_PUBLIC_SPOTIFY_EMBED_SRC?.trim() ||
    DEFAULT_XVOHSOME_SPOTIFY_URL;
  return toSpotifyEmbedUrl(raw);
}
