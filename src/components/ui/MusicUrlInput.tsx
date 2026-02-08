import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { detectMusicSource, isValidMusicUrl, MusicSourceType } from "@/lib/musicEmbed";
import { Music, ExternalLink } from "lucide-react";

interface MusicUrlInputProps {
  value?: string;
  onChange: (url: string) => void;
  onSourceTypeChange?: (type: MusicSourceType) => void;
}

const sourceLabels: Record<MusicSourceType, { label: string; color: string }> = {
  spotify: { label: "Spotify", color: "bg-green-500" },
  youtube: { label: "YouTube", color: "bg-red-500" },
  soundcloud: { label: "SoundCloud", color: "bg-orange-500" },
  direct: { label: "Direct Link", color: "bg-blue-500" },
  unknown: { label: "Unknown", color: "bg-muted" },
};

export function MusicUrlInput({ value, onChange, onSourceTypeChange }: MusicUrlInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [sourceType, setSourceType] = useState<MusicSourceType>("unknown");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (inputValue) {
      const source = detectMusicSource(inputValue);
      setSourceType(source.type);
      setIsValid(isValidMusicUrl(inputValue) && source.type !== "unknown");
      onSourceTypeChange?.(source.type);
    } else {
      setSourceType("unknown");
      setIsValid(false);
    }
  }, [inputValue, onSourceTypeChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          Music URL
        </Label>
        {inputValue && sourceType !== "unknown" && (
          <Badge variant="secondary" className={`text-white ${sourceLabels[sourceType].color}`}>
            {sourceLabels[sourceType].label}
          </Badge>
        )}
      </div>
      
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder="Paste Spotify, YouTube, SoundCloud, or MP3 link..."
        className={!isValid && inputValue ? "border-yellow-500" : ""}
      />
      
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <ExternalLink className="h-3 w-3" />
        Supports Spotify, YouTube, SoundCloud, and direct audio links
      </p>
    </div>
  );
}
