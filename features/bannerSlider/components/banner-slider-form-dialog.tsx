"use client";

import { useState, useEffect } from "react";
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
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
      });
    } else {
      setFormData({
        title: { ka: "", en: "" },
        description: { ka: "", en: "" },
        imageUrl: "",
      });
    }
  }, [banner, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as CreateBannerDto | UpdateBannerDto);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {banner ? "Edit Banner" : "Create Banner"}
            </DialogTitle>
            <DialogDescription>
              {banner ? "Update banner information." : "Add a new banner."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
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
                      English
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
                <Label>Description</Label>
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
                      English
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
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{banner ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
