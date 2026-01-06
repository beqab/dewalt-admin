"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Category, UpdateCategoryDto } from "../types";
import { useUpdateCategory } from "@/features/categories";

interface AssignToBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  brandName: string;
  categories: Category[];
  onSuccess?: () => void;
}

export function AssignToBrandDialog({
  isOpen,
  onClose,
  brandId,
  brandName,
  categories,
  onSuccess,
}: AssignToBrandDialogProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const updateCategory = useUpdateCategory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && brandId) {
      // Pre-select categories that are already assigned to this brand
      const preSelectedCategories = categories
        .filter((cat) => {
          const brandIds = Array.isArray(cat.brandIds)
            ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
            : [];
          return brandIds.includes(brandId);
        })
        .map((cat) => cat._id);
      setSelectedCategoryIds(preSelectedCategories);
    }
  }, [isOpen, brandId, categories]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAssign = async () => {
    if (!brandId) {
      toast.error("Please select a brand");
      return;
    }

    // Get all categories (both selected and previously assigned)
    const previouslyAssignedCategoryIds = categories
      .filter((cat) => {
        const brandIds = Array.isArray(cat.brandIds)
          ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
          : [];
        return brandIds.includes(brandId);
      })
      .map((cat) => cat._id);

    // Categories to add brand to
    const categoriesToAdd = selectedCategoryIds.filter(
      (id) => !previouslyAssignedCategoryIds.includes(id)
    );

    // Categories to remove brand from
    const categoriesToRemove = previouslyAssignedCategoryIds.filter(
      (id) => !selectedCategoryIds.includes(id)
    );

    const updatePromises: Promise<unknown>[] = [];

    // Add brand to new categories
    categoriesToAdd.forEach((categoryId) => {
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const currentBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.includes(brandId)
        ? currentBrandIds
        : [...currentBrandIds, brandId];

      updatePromises.push(
        updateCategory.mutateAsync({
          id: categoryId,
          data: { brandIds: newBrandIds } as UpdateCategoryDto,
        })
      );
    });

    // Remove brand from unselected categories
    categoriesToRemove.forEach((categoryId) => {
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const currentBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.filter((id) => id !== brandId);

      updatePromises.push(
        updateCategory.mutateAsync({
          id: categoryId,
          data: { brandIds: newBrandIds } as UpdateCategoryDto,
        })
      );
    });

    if (updatePromises.length === 0) {
      toast.info("No changes to apply");
      onClose();
      return;
    }

    try {
      await Promise.all(updatePromises);
      const addCount = categoriesToAdd.length;
      const removeCount = categoriesToRemove.length;
      const message = [];
      if (addCount > 0)
        message.push(`Added ${addCount} categor${addCount > 1 ? "ies" : "y"}`);
      if (removeCount > 0)
        message.push(
          `Removed ${removeCount} categor${removeCount > 1 ? "ies" : "y"}`
        );
      toast.success(`Successfully updated: ${message.join(", ")}`);
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update category assignments");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Categories to Brand</DialogTitle>
          <DialogDescription>
            Select categories to assign to {brandName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {categories.map((category) => {
            const categoryBrandIds = Array.isArray(category.brandIds)
              ? category.brandIds.map((b) =>
                  typeof b === "string" ? b : b._id
                )
              : [];
            const isAssigned = categoryBrandIds.includes(brandId);
            const isSelected = selectedCategoryIds.includes(category._id);

            return (
              <div
                key={category._id}
                className="flex items-center space-x-2 p-2 border rounded"
              >
                <Checkbox
                  id={`category-${category._id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleToggleCategory(category._id)}
                />
                <Label
                  htmlFor={`category-${category._id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{category.name.en}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.name.ka}
                      </div>
                    </div>
                    {isAssigned && (
                      <span className="text-xs text-muted-foreground">
                        Already assigned
                      </span>
                    )}
                  </div>
                </Label>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No categories available
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={updateCategory.isPending}
          >
            {updateCategory.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Assign Selected ({selectedCategoryIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
