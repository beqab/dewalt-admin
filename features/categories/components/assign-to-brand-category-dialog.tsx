"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { ChildCategory, UpdateChildCategoryDto } from "../types";
import {
  useUpdateChildCategory,
  useGetBrands,
  useGetCategories,
} from "@/features/categories";
import { BrandSelector } from "./brand-selector";

interface AssignToBrandCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  childCategories: ChildCategory[];
  onSuccess?: () => void;
}

export function AssignToBrandCategoryDialog({
  isOpen,
  onClose,
  childCategories,
  onSuccess,
}: AssignToBrandCategoryDialogProps) {
  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();
  const updateChildCategory = useUpdateChildCategory();

  const [selectedBrandForAssign, setSelectedBrandForAssign] =
    useState<string>("");
  const [selectedCategoryForAssign, setSelectedCategoryForAssign] =
    useState<string>("");
  const [selectedChildCategoryIds, setSelectedChildCategoryIds] = useState<
    string[]
  >([]);

  // Filter categories by selected brand
  const categoriesForBrand = useMemo(() => {
    return selectedBrandForAssign
      ? categories?.filter((cat) => {
          const brandIds = Array.isArray(cat.brandIds)
            ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
            : [];
          return brandIds.includes(selectedBrandForAssign);
        })
      : categories;
  }, [selectedBrandForAssign, categories]);

  // Compute initial selected child categories
  const initialSelectedChildCategoryIds = useMemo(() => {
    if (
      selectedBrandForAssign &&
      selectedCategoryForAssign &&
      childCategories
    ) {
      return childCategories
        .filter((childCat) => {
          const childCategoryBrandIds = Array.isArray(childCat.brandIds)
            ? childCat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
            : [];
          const childCategoryId =
            typeof childCat.categoryId === "string"
              ? childCat.categoryId
              : childCat.categoryId?._id;
          return (
            childCategoryBrandIds.includes(selectedBrandForAssign) &&
            childCategoryId === selectedCategoryForAssign
          );
        })
        .map((childCat) => childCat._id);
    }
    return [];
  }, [selectedBrandForAssign, selectedCategoryForAssign, childCategories]);

  // Reset selected child categories when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedChildCategoryIds(initialSelectedChildCategoryIds);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialSelectedChildCategoryIds]);

  // Validate selected category when brand changes
  useEffect(() => {
    if (selectedBrandForAssign && selectedCategoryForAssign) {
      const category = categoriesForBrand?.find(
        (c) => c._id === selectedCategoryForAssign
      );
      if (!category) {
        const timer = setTimeout(() => {
          setSelectedCategoryForAssign("");
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedBrandForAssign, categoriesForBrand, selectedCategoryForAssign]);

  const handleToggleChildCategory = (childCategoryId: string) => {
    setSelectedChildCategoryIds((prev) =>
      prev.includes(childCategoryId)
        ? prev.filter((id) => id !== childCategoryId)
        : [...prev, childCategoryId]
    );
  };

  const handleAssign = async () => {
    if (!selectedBrandForAssign || !selectedCategoryForAssign) {
      toast.error("Please select both brand and category");
      return;
    }

    const allChildCategories = childCategories || [];
    const previouslyAssignedChildCategoryIds = allChildCategories
      .filter((childCat) => {
        const childCategoryBrandIds = Array.isArray(childCat.brandIds)
          ? childCat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
          : [];
        const childCategoryId =
          typeof childCat.categoryId === "string"
            ? childCat.categoryId
            : childCat.categoryId?._id;
        return (
          childCategoryBrandIds.includes(selectedBrandForAssign) &&
          childCategoryId === selectedCategoryForAssign
        );
      })
      .map((childCat) => childCat._id);

    const childCategoriesToAdd = selectedChildCategoryIds.filter(
      (id) => !previouslyAssignedChildCategoryIds.includes(id)
    );

    const childCategoriesToRemove = previouslyAssignedChildCategoryIds.filter(
      (id) => !selectedChildCategoryIds.includes(id)
    );

    const updatePromises: Promise<unknown>[] = [];

    // Add brand and category to new child categories
    childCategoriesToAdd.forEach((childCategoryId) => {
      const childCategory = childCategories.find(
        (c) => c._id === childCategoryId
      );
      if (!childCategory) return;

      const currentBrandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.includes(selectedBrandForAssign)
        ? currentBrandIds
        : [...currentBrandIds, selectedBrandForAssign];

      updatePromises.push(
        updateChildCategory.mutateAsync({
          id: childCategoryId,
          data: {
            brandIds: newBrandIds,
            categoryId: selectedCategoryForAssign,
          } as UpdateChildCategoryDto,
        })
      );
    });

    // Remove brand and category from unselected child categories
    childCategoriesToRemove.forEach((childCategoryId) => {
      const childCategory = childCategories.find(
        (c) => c._id === childCategoryId
      );
      if (!childCategory) return;

      const currentBrandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.filter(
        (id) => id !== selectedBrandForAssign
      );

      const updateData: UpdateChildCategoryDto = {
        brandIds: newBrandIds,
      };
      if (newBrandIds.length === 0) {
        updateData.categoryId = undefined;
      } else {
        const currentCategoryId =
          typeof childCategory.categoryId === "string"
            ? childCategory.categoryId
            : childCategory.categoryId?._id;
        if (currentCategoryId === selectedCategoryForAssign) {
          updateData.categoryId = currentCategoryId;
        }
      }

      updatePromises.push(
        updateChildCategory.mutateAsync({
          id: childCategoryId,
          data: updateData,
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
      const addCount = childCategoriesToAdd.length;
      const removeCount = childCategoriesToRemove.length;
      const message = [];
      if (addCount > 0)
        message.push(
          `Added ${addCount} child categor${addCount > 1 ? "ies" : "y"}`
        );
      if (removeCount > 0)
        message.push(
          `Removed ${removeCount} child categor${removeCount > 1 ? "ies" : "y"}`
        );
      toast.success(`Successfully updated: ${message.join(", ")}`);
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update child category assignments");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Child Categories to Brand + Category</DialogTitle>
          <DialogDescription>
            Select a brand, its category, and child categories to assign
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Brand Selection */}
          <BrandSelector
            brands={brands}
            value={selectedBrandForAssign}
            onValueChange={(value) => {
              setSelectedBrandForAssign(value);
              setSelectedCategoryForAssign("");
            }}
            id="assign-brand-select"
          />

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="assign-category-select">Select Category</Label>
            <Select
              value={selectedCategoryForAssign}
              onValueChange={setSelectedCategoryForAssign}
              disabled={!selectedBrandForAssign}
            >
              <SelectTrigger id="assign-category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesForBrand?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name.en}
                  </SelectItem>
                ))}
                {selectedBrandForAssign && categoriesForBrand?.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    No categories available for this brand
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Child Categories Selection */}
          <div className="space-y-2">
            <Label>Select Child Categories</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-4">
              {childCategories.map((childCategory) => {
                const childCategoryBrandIds = Array.isArray(
                  childCategory.brandIds
                )
                  ? childCategory.brandIds.map((b) =>
                      typeof b === "string" ? b : b._id
                    )
                  : [];
                const childCategoryId =
                  typeof childCategory.categoryId === "string"
                    ? childCategory.categoryId
                    : childCategory.categoryId?._id;
                const isAssigned =
                  selectedBrandForAssign &&
                  selectedCategoryForAssign &&
                  childCategoryBrandIds.includes(selectedBrandForAssign) &&
                  childCategoryId === selectedCategoryForAssign;
                const isSelected = selectedChildCategoryIds.includes(
                  childCategory._id
                );

                return (
                  <div
                    key={childCategory._id}
                    className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
                  >
                    <Checkbox
                      id={`assign-child-category-${childCategory._id}`}
                      checked={isSelected}
                      onCheckedChange={() =>
                        handleToggleChildCategory(childCategory._id)
                      }
                    />
                    <Label
                      htmlFor={`assign-child-category-${childCategory._id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {childCategory.name.en}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {childCategory.name.ka}
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
              {childCategories.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No child categories available
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              setSelectedBrandForAssign("");
              setSelectedCategoryForAssign("");
              setSelectedChildCategoryIds([]);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={
              !selectedBrandForAssign ||
              !selectedCategoryForAssign ||
              selectedChildCategoryIds.length === 0 ||
              updateChildCategory.isPending
            }
          >
            {updateChildCategory.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Assign ({selectedChildCategoryIds.length} child categor
                {selectedChildCategoryIds.length > 1 ? "ies" : "y"})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
