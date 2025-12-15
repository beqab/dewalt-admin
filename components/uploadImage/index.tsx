import { Label } from "@radix-ui/react-label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UploadImageProps {
  onImageChange: (url: string) => void;
  imageUrl: string;
  label?: string;
  defaultImageUrl?: string;
}

export default function UploadImage({
  onImageChange,
  imageUrl,
  defaultImageUrl,
  label = "Image",
}: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultImageUrl) {
      setPreviewUrl(defaultImageUrl);
    }
  }, [defaultImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      onImageChange(data.url);

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(data.url);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      setPreviewUrl(null);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor="image">{label}</Label>
      <div className="space-y-2">
        {previewUrl ? (
          <div className="relative w-full h-48 border rounded-md overflow-hidden">
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-md p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <Label
                  htmlFor="image"
                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Click to upload image
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          </div>
        )}
        <Input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {imageUrl && <Input type="hidden" value={imageUrl} required />}
      </div>
    </div>
  );
}
