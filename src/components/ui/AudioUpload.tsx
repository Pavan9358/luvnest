import { useRef } from "react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { Button } from "@/components/ui/button";
import { Music, Upload, X, Loader2 } from "lucide-react";

interface AudioUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  lovePageId?: string;
}

export function AudioUpload({ value, onChange, lovePageId }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useMediaUpload({ lovePageId });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      onChange(result.url);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Audio uploaded</p>
            <audio controls className="w-full h-8 mt-1">
              <source src={value} />
            </audio>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Upload an audio file
              </p>
              <p className="text-xs text-muted-foreground">
                MP3, WAV, or OGG (max 10MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
