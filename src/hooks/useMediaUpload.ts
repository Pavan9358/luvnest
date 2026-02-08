import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface UseMediaUploadOptions {
  lovePageId?: string;
  onSuccess?: (url: string) => void;
}

interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("Please sign in to upload files");
      return null;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 10MB");
      return null;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. Please upload an image or audio file.");
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("love-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("love-media")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Record in media_files table
      const fileType = file.type.startsWith("image/") ? "image" : "audio";
      await supabase.from("media_files").insert({
        user_id: user.id,
        love_page_id: options.lovePageId || null,
        file_name: file.name,
        file_url: publicUrl,
        file_type: fileType,
        file_size: file.size,
        mime_type: file.type,
      });

      setProgress(100);

      const result = {
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: fileType,
      };

      options.onSuccess?.(publicUrl);
      
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i]);
      if (result) {
        results.push(result);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    
    return results;
  };

  return {
    uploadFile,
    uploadMultiple,
    uploading,
    progress,
  };
}
