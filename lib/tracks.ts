/** Shared shape for tracks served from `public/uploaded tracks` via `/api/tracks`. */
export interface UploadedTrack {
  id: string;
  filename: string;
  title: string;
  url: string;
}
