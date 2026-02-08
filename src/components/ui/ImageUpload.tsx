import { useRef, useState } from "react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  aspectRatio?: "video" | "square" | "portrait";
  className?: string;
  lovePageId?: string;
}

export function ImageUpload({
  value,
  onChange,
  aspectRatio = "video",
  className = "",
  lovePageId,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useMediaUpload({ lovePageId });

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

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

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className={`relative rounded-lg overflow-hidden ${aspectClasses[aspectRatio]} bg-muted`}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`border-2 border-dashed border-muted-foreground/25 rounded-lg ${aspectClasses[aspectRatio]} flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
