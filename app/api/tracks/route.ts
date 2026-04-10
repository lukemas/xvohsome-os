import { NextResponse } from "next/server";
import type { UploadedTrack } from "@/lib/tracks";

/**
 * Keep Node-only APIs inside the handler (dynamic import).
 * Top-level `import fs from "fs"` can break route bundling in some setups.
 */
export const runtime = "nodejs";

const UPLOAD_FOLDER = "uploaded tracks";

const AUDIO_EXT = new Set([
  ".mp3",
  ".wav",
  ".ogg",
  ".oga",
  ".m4a",
  ".aac",
  ".opus",
  ".webm",
]);

function publicUrlForFile(filename: string): string {
  const segments = [UPLOAD_FOLDER, filename];
  return "/" + segments.map((s) => encodeURIComponent(s)).join("/");
}

async function listTracksFromDisk(): Promise<UploadedTrack[]> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const dir = path.join(process.cwd(), "public", UPLOAD_FOLDER);
  await fs.mkdir(dir, { recursive: true });

  const names = await fs.readdir(dir);
  const tracks: UploadedTrack[] = [];

  for (const name of names) {
    const ext = path.extname(name).toLowerCase();
    if (!AUDIO_EXT.has(ext)) continue;

    const fullPath = path.join(dir, name);
    try {
      const st = await fs.stat(fullPath);
      if (!st.isFile()) continue;
    } catch {
      continue;
    }

    tracks.push({
      id: name,
      filename: name,
      title: path.basename(name, ext),
      url: publicUrlForFile(name),
    });
  }

  tracks.sort((a, b) => a.title.localeCompare(b.title));
  return tracks;
}

export async function GET() {
  try {
    const tracks = await listTracksFromDisk();
    return NextResponse.json({ tracks });
  } catch (err) {
    console.error("[api/tracks]", err);
    return NextResponse.json(
      {
        error: "Could not list tracks from disk.",
        tracks: [] as UploadedTrack[],
      },
      { status: 200 },
    );
  }
}
