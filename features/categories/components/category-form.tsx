"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../types";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onCreate: (data: CreateCategoryDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateCategoryDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function CategoryForm({
  isOpen,
  onClose,
  category,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
  });

  //eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
      });
    } else {
      setFormData({
        name: { ka: "", en: "" },
        slug: "",
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.ka || !formData.name.en) {
      toast.error("Please fill in both Georgian and English names");
      return;
    }
    if (!formData.slug) {
      toast.error("Please enter a slug");
      return;
    }

    try {
      if (category) {
        await onUpdate(category._id, formData);
      } else {
        await onCreate(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {category ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {category
                ? "Update category information."
                : "Add a new category. You can assign it to brands later."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="category-name-ka"
                    className="text-sm text-muted-foreground"
                  >
                    Georgian (ქართული)
                  </Label>
                  <Input
                    id="category-name-ka"
                    value={formData.name.ka}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, ka: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="category-name-en"
                    className="text-sm text-muted-foreground"
                  >
                    English
                  </Label>
                  <Input
                    id="category-name-en"
                    value={formData.name.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, en: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="power-tools"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (must be unique)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {category ? "Updating..." : "Creating..."}
                </>
              ) : category ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
