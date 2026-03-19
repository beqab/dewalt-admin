"use client";

import { Label } from "@radix-ui/react-label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface MultipleImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  images: string[];
  label?: string;
  maxImages?: number;
}

function resetFileInput(el: HTMLInputElement | null) {
  if (el) el.value = "";
}

export default function MultipleImageUpload({
  onImagesChange,
  images,
  label = "დამატებითი სურათები",
  maxImages = 6,
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Always append to the latest images (avoids stale closures vs Formik/async). */
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const current = imagesRef.current;

    // Check if we've reached the max limit
    if (current.length >= maxImages) {
      toast.error(`მაქსიმუმ ${maxImages} სურათი შეიძლება.`);
      resetFileInput(fileInputRef.current);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("ფაილის ტიპი არასწორია. დასაშვებია მხოლოდ სურათები.");
      resetFileInput(fileInputRef.current);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("ფაილის ზომა აღემატება 5MB-ს.");
      resetFileInput(fileInputRef.current);
      return;
    }

    // Upload file
    setIsUploading(true);
    setUploadingIndex(current.length);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "სურათის ატვირთვა ვერ მოხერხდა");
      }

      const data = await response.json();
      const latest = imagesRef.current;
      onImagesChange([...latest, data.url]);

      toast.success("სურათი წარმატებით აიტვირთა!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "სურათის ატვირთვა ვერ მოხერხდა"
      );
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
      resetFileInput(fileInputRef.current);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square border rounded-md overflow-hidden group"
            >
              <Image
                src={imageUrl}
                alt={`პროდუქტის სურათი ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && (
        <div>
          {/* არა ორმაგი ტრიგერი: htmlFor + ref.click() ზოგ ბრაუზერში ფაილის დიალოგს არღვევს */}
          <label
            htmlFor={isUploading ? undefined : "multiple-images"}
            className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors block ${
              isUploading
                ? "border-muted bg-muted pointer-events-none"
                : "border-primary/20 hover:border-primary/40"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-center">
                <span className="text-sm font-medium text-primary">
                  {isUploading && uploadingIndex !== null
                    ? "იტვირთება..."
                    : "დააჭირეთ სურათის ასატვირთად"}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP — მაქს. 5MB
                </p>
              </div>
            </div>
          </label>
          <Input
            ref={fileInputRef}
            id="multiple-images"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-muted-foreground">
          მიღწეულია მაქსიმუმ {maxImages} სურათი. წაშალეთ ერთი სურათი, რომ დაამატოთ სხვა.
        </p>
      )}
    </div>
  );
}

