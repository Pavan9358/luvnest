import { useEffect, useRef } from "react";
import { detectMusicSource } from "@/lib/musicEmbed";

interface BackgroundAudioPlayerProps {
  url: string;
}

export function BackgroundAudioPlayer({ url }: BackgroundAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);
  
  const source = detectMusicSource(url);

  useEffect(() => {
    // Only handle direct audio files for invisible autoplay
    // Embeds (Spotify/YouTube/SoundCloud) cannot be autoplayed invisibly
    if (source.type !== "direct" || !source.url) return;

    const audio = new Audio(source.url);
    audioRef.current = audio;
    
    // Configure for background ambient playback
    audio.loop = true;
    audio.volume = 0.4; // Low ambient volume
    audio.muted = true; // Start muted to bypass autoplay restrictions
    
    const attemptAutoplay = async () => {
      if (hasAttemptedPlay.current) return;
      hasAttemptedPlay.current = true;

      try {
        // Start playing while muted (allowed by browsers)
        await audio.play();
        
        // Once playing, unmute after a brief moment
        // This bypasses browser autoplay restrictions
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.muted = false;
          }
        }, 100);
      } catch (error) {
        // Autoplay still blocked - try again on first user interaction
        const handleFirstInteraction = async () => {
          try {
            await audio.play();
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.muted = false;
              }
            }, 100);
          } catch {
            // Silently fail - some browsers are very strict
          }
          // Remove listeners after first attempt
          document.removeEventListener("click", handleFirstInteraction);
          document.removeEventListener("touchstart", handleFirstInteraction);
          document.removeEventListener("scroll", handleFirstInteraction);
        };

        document.addEventListener("click", handleFirstInteraction, { once: true });
        document.addEventListener("touchstart", handleFirstInteraction, { once: true });
        document.addEventListener("scroll", handleFirstInteraction, { once: true });
      }
    };

    // Attempt autoplay when component mounts
    attemptAutoplay();

    // Cleanup: stop audio when component unmounts (user navigates away)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      hasAttemptedPlay.current = false;
    };
  }, [source.url, source.type]);

  // Render nothing - completely invisible audio
  return null;
}
