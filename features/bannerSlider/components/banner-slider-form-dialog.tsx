"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UploadImage from "@/components/uploadImage";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Banner, CreateBannerDto, UpdateBannerDto } from "../types";

interface BannerSliderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner;
  onSubmit: (data: CreateBannerDto | UpdateBannerDto) => void;
}

export function BannerSliderFormDialog({
  open,
  onOpenChange,
  banner,
  onSubmit,
}: BannerSliderFormDialogProps) {
  const [formData, setFormData] = useState({
    title: { ka: "", en: "" },
    description: { ka: "", en: "" },
    imageUrl: "",
    buttonLink: "",
  });

  useEffect(() => {
    if (banner) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        buttonLink: banner.buttonLink || "",
      });
    } else {
      setFormData({
        title: { ka: "", en: "" },
        description: { ka: "", en: "" },
        imageUrl: "",
        buttonLink: "",
      });
    }
  }, [banner, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("გთხოვთ ატვირთოთ სურათი");
      return;
    }
    onSubmit(formData as CreateBannerDto | UpdateBannerDto);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {banner ? "ბანერის რედაქტირება" : "ბანერის შექმნა"}
            </DialogTitle>
            <DialogDescription>
              {banner ? "ბანერის ინფორმაციის განახლება." : "ახალი ბანერის დამატება."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>სათაური</Label>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="title-ka"
                      className="text-sm text-muted-foreground"
                    >
                      Georgian (ქართული)
                    </Label>
                    <Input
                      id="title-ka"
                      value={formData.title.ka}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, ka: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="title-en"
                      className="text-sm text-muted-foreground"
                    >
                      ინგლისურად
                    </Label>
                    <Input
                      id="title-en"
                      value={formData.title.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, en: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>აღწერა</Label>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="description-ka"
                      className="text-sm text-muted-foreground"
                    >
                      Georgian (ქართული)
                    </Label>
                    <Textarea
                      id="description-ka"
                      value={formData.description.ka}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: {
                            ...formData.description,
                            ka: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="description-en"
                      className="text-sm text-muted-foreground"
                    >
                      ინგლისურად
                    </Label>
                    <Textarea
                      id="description-en"
                      value={formData.description.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: {
                            ...formData.description,
                            en: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <UploadImage
                onImageChange={(url) =>
                  setFormData({ ...formData, imageUrl: url })
                }
                imageUrl={formData.imageUrl}
                defaultImageUrl={banner?.imageUrl}
                label="სურათი"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="buttonLink">ღილაკის ბმული</Label>
              <Input
                id="buttonLink"
                type="url"
                value={formData.buttonLink}
                onChange={(e) =>
                  setFormData({ ...formData, buttonLink: e.target.value })
                }
                placeholder="https://example.com/products"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              გაუქმება
            </Button>
            <Button type="submit">{banner ? "განახლება" : "შექმნა"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
