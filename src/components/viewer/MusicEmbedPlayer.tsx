import { useState, useRef, useEffect } from "react";
import { detectMusicSource, MusicSource } from "@/lib/musicEmbed";
import { Music, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicEmbedPlayerProps {
  url: string;
  title?: string;
  autoplay?: boolean;
}

export function MusicEmbedPlayer({ url, title = "Our Song", autoplay = false }: MusicEmbedPlayerProps) {
  const source = detectMusicSource(url);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle autoplay with user interaction consideration
  useEffect(() => {
    if (autoplay && audioRef.current && source.type === "direct") {
      // Browsers block autoplay without user interaction
      // We'll try to play, but it might fail silently
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to click
      });
    }
  }, [autoplay, source.type]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(percent);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const time = (value[0] / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0] / 100;
    setVolume(value[0]);
  };

  // Render based on source type
  if (source.type === "spotify" && source.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-xl font-display font-semibold mb-4 text-center">{title}</h3>
        <iframe
          src={source.embedUrl}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          title="Spotify Player"
        />
      </div>
    );
  }

  if (source.type === "youtube" && source.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-xl font-display font-semibold mb-4 text-center">{title}</h3>
        <div className="aspect-video rounded-xl overflow-hidden">
          <iframe
            src={source.embedUrl}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
            title="YouTube Player"
          />
        </div>
      </div>
    );
  }

  if (source.type === "soundcloud" && source.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-xl font-display font-semibold mb-4 text-center">{title}</h3>
        <iframe
          src={source.embedUrl}
          width="100%"
          height="166"
          allow="autoplay"
          className="rounded-xl border-0"
          title="SoundCloud Player"
        />
      </div>
    );
  }

  // Direct audio player
  if (source.type === "direct" || source.url) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="card-romantic p-8 rounded-xl text-center">
          <Music className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold mb-6">{title}</h3>

          <audio
            ref={audioRef}
            src={source.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Play button */}
          <Button
            size="lg"
            className="w-16 h-16 rounded-full btn-romantic mb-6"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </Button>

          {/* Progress bar */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>

          {/* Volume control */}
          <div className="flex items-center justify-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
