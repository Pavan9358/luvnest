export type MusicSourceType = "spotify" | "youtube" | "soundcloud" | "direct" | "unknown";

export interface MusicSource {
  type: MusicSourceType;
  url: string;
  embedUrl?: string;
}

/**
 * Detect the source type from a music URL
 */
export function detectMusicSource(url: string): MusicSource {
  if (!url || url.trim() === "") {
    return { type: "unknown", url: "" };
  }

  const trimmedUrl = url.trim();

  // Spotify
  if (trimmedUrl.includes("spotify.com") || trimmedUrl.includes("spotify:")) {
    const trackMatch = trimmedUrl.match(/track\/([a-zA-Z0-9]+)/);
    const playlistMatch = trimmedUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    const albumMatch = trimmedUrl.match(/album\/([a-zA-Z0-9]+)/);
    
    let embedPath = "";
    if (trackMatch) {
      embedPath = `track/${trackMatch[1]}`;
    } else if (playlistMatch) {
      embedPath = `playlist/${playlistMatch[1]}`;
    } else if (albumMatch) {
      embedPath = `album/${albumMatch[1]}`;
    }

    return {
      type: "spotify",
      url: trimmedUrl,
      embedUrl: embedPath ? `https://open.spotify.com/embed/${embedPath}?utm_source=generator&theme=0` : undefined,
    };
  }

  // YouTube
  if (trimmedUrl.includes("youtube.com") || trimmedUrl.includes("youtu.be")) {
    let videoId = "";
    
    if (trimmedUrl.includes("youtu.be/")) {
      videoId = trimmedUrl.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
    } else {
      const match = trimmedUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      videoId = match?.[1] || "";
    }

    return {
      type: "youtube",
      url: trimmedUrl,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : undefined,
    };
  }

  // SoundCloud
  if (trimmedUrl.includes("soundcloud.com")) {
    return {
      type: "soundcloud",
      url: trimmedUrl,
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmedUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
    };
  }

  // Direct MP3/audio file
  const audioExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];
  if (audioExtensions.some((ext) => trimmedUrl.toLowerCase().endsWith(ext))) {
    return {
      type: "direct",
      url: trimmedUrl,
    };
  }

  // Unknown URL - could still be a direct link
  return {
    type: "direct",
    url: trimmedUrl,
  };
}

/**
 * Check if a URL is a valid music URL
 */
export function isValidMusicUrl(url: string): boolean {
  if (!url || url.trim() === "") return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
