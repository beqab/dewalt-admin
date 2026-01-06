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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type {
  ChildCategory,
  CreateChildCategoryDto,
  UpdateChildCategoryDto,
} from "../types";
import { useGetBrands, useGetCategories } from "@/features/categories";

interface ChildCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  childCategory?: ChildCategory;
  onCreate: (data: CreateChildCategoryDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateChildCategoryDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function ChildCategoryForm({
  isOpen,
  onClose,
  childCategory,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
}: ChildCategoryFormProps) {
  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
    brandIds: [] as string[],
    categoryId: undefined as string | undefined,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (childCategory) {
      const brandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];
      const categoryId =
        typeof childCategory.categoryId === "string"
          ? childCategory.categoryId
          : childCategory.categoryId?._id || undefined;
      setFormData({
        name: childCategory.name,
        slug: childCategory.slug,
        brandIds,
        categoryId,
      });
    } else {
      setFormData({
        name: { ka: "", en: "" },
        slug: "",
        brandIds: [],
        categoryId: undefined,
      });
    }
  }, [childCategory]);

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
      if (childCategory) {
        const updateData: UpdateChildCategoryDto = {
          name: formData.name,
          slug: formData.slug,
          brandIds: formData.brandIds,
          categoryId: formData.categoryId || undefined,
        };
        await onUpdate(childCategory._id, updateData);
      } else {
        await onCreate(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const availableCategories = categories?.filter((category) => {
    if (formData.brandIds.length > 0) {
      const categoryBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];
      return formData.brandIds.some((brandId) =>
        categoryBrandIds.includes(brandId)
      );
    }
    return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {childCategory ? "Edit Child Category" : "Create Child Category"}
            </DialogTitle>
            <DialogDescription>
              {childCategory
                ? "Update child category information."
                : "Add a new child category. You can assign it to brands and categories later."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="child-category-name-ka"
                    className="text-sm text-muted-foreground"
                  >
                    Georgian (ქართული)
                  </Label>
                  <Input
                    id="child-category-name-ka"
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
                    htmlFor="child-category-name-en"
                    className="text-sm text-muted-foreground"
                  >
                    English
                  </Label>
                  <Input
                    id="child-category-name-en"
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
              <Label htmlFor="child-category-slug">Slug</Label>
              <Input
                id="child-category-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="drills"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (must be unique)
              </p>
            </div>

            {/* Current Brands - Show and allow removal */}
            {childCategory && formData.brandIds.length > 0 && (
              <div className="space-y-2">
                <Label>Current Brands</Label>
                <div className="space-y-2">
                  {formData.brandIds.map((brandId) => {
                    const brand = brands?.find((b) => b._id === brandId);
                    if (!brand) return null;
                    return (
                      <div
                        key={brandId}
                        className="flex items-center justify-between p-2 border rounded bg-muted/50"
                      >
                        <span className="text-sm font-medium">
                          {brand.name.en}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              brandIds: formData.brandIds.filter(
                                (id) => id !== brandId
                              ),
                            });
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Brands */}
            {childCategory && (
              <div className="space-y-2">
                <Label>Add Brands</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {brands
                    ?.filter((brand) => !formData.brandIds.includes(brand._id))
                    .map((brand) => (
                      <Button
                        key={brand._id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            brandIds: [...formData.brandIds, brand._id],
                          });
                        }}
                        className="w-full justify-start"
                      >
                        + {brand.name.en}
                      </Button>
                    ))}
                  {brands?.filter(
                    (brand) => !formData.brandIds.includes(brand._id)
                  ).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      All brands are assigned
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Current Category - Show and allow removal */}
            {childCategory && formData.categoryId && (
              <div className="space-y-2">
                <Label>Current Category</Label>
                <div className="flex items-center justify-between p-2 border rounded bg-muted/50">
                  <span className="text-sm font-medium">
                    {categories?.find((c) => c._id === formData.categoryId)
                      ?.name.en || "Unknown"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        categoryId: undefined,
                      });
                    }}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            {/* Add Category */}
            {childCategory && (
              <div className="space-y-2">
                <Label htmlFor="child-category-category">
                  {formData.categoryId ? "Change Category" : "Add Category"}
                </Label>
                <Select
                  value={formData.categoryId || ""}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      categoryId: value || undefined,
                    });
                  }}
                >
                  <SelectTrigger id="child-category-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.brandIds.length > 0
                    ? "Only categories for selected brands are shown."
                    : "Select a parent category."}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {childCategory ? "Updating..." : "Creating..."}
                </>
              ) : childCategory ? (
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
