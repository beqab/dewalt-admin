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
import type { ChildCategory } from "../types";
import {
  useGetBrands,
  useGetCategories,
  useGetChildCategories,
  useSetChildCategoryGroup,
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
  const setChildCategoryGroup = useSetChildCategoryGroup();

  const [selectedBrandForAssign, setSelectedBrandForAssign] =
    useState<string>("");
  const [selectedCategoryForAssign, setSelectedCategoryForAssign] =
    useState<string>("");
  const [selectedChildCategoryIds, setSelectedChildCategoryIds] = useState<
    string[]
  >([]);

  const { data: assignedChildCategories } = useGetChildCategories(
    selectedBrandForAssign || undefined,
    selectedCategoryForAssign || undefined,
    { enabled: Boolean(selectedBrandForAssign && selectedCategoryForAssign) }
  );

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

  const assignedChildCategoryIds = useMemo(() => {
    if (!assignedChildCategories || assignedChildCategories.length === 0) {
      return [];
    }
    return assignedChildCategories.map((childCat) => childCat._id);
  }, [assignedChildCategories]);

  const hasChanges = useMemo(() => {
    if (assignedChildCategoryIds.length !== selectedChildCategoryIds.length) {
      return true;
    }
    const assignedSet = new Set(assignedChildCategoryIds);
    return selectedChildCategoryIds.some((id) => !assignedSet.has(id));
  }, [assignedChildCategoryIds, selectedChildCategoryIds]);

  // Reset selected child categories when dependencies change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedBrandForAssign || !selectedCategoryForAssign) {
      setSelectedChildCategoryIds([]);
      return;
    }
    const timer = setTimeout(() => {
      setSelectedChildCategoryIds(assignedChildCategoryIds);
    }, 0);
    return () => clearTimeout(timer);
  }, [
    assignedChildCategoryIds,
    selectedBrandForAssign,
    selectedCategoryForAssign,
  ]);

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
      toast.error("გთხოვთ აირჩიოთ ბრენდი და კატეგორია");
      return;
    }

    const previouslyAssignedChildCategoryIds = assignedChildCategoryIds;
    const childCategoriesToAdd = selectedChildCategoryIds.filter(
      (id) => !previouslyAssignedChildCategoryIds.includes(id)
    );
    const childCategoriesToRemove = previouslyAssignedChildCategoryIds.filter(
      (id) => !selectedChildCategoryIds.includes(id)
    );

    const hasChanges =
      childCategoriesToAdd.length > 0 || childCategoriesToRemove.length > 0;

    if (!hasChanges) {
      toast.info("ცვლილებები არ არის");
      onClose();
      return;
    }

    try {
      await setChildCategoryGroup.mutateAsync({
        brandId: selectedBrandForAssign,
        categoryId: selectedCategoryForAssign,
        childCategoryIds: selectedChildCategoryIds,
      });
      const addCount = childCategoriesToAdd.length;
      const removeCount = childCategoriesToRemove.length;
      const message: string[] = [];
      if (addCount > 0) message.push(`დამატებულია ${addCount} ქვე-კატეგორია`);
      if (removeCount > 0)
        message.push(`წაშლილია ${removeCount} ქვე-კატეგორია`);
      toast.success(`წარმატებით განახლდა: ${message.join(", ")}`);
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("ქვე-კატეგორიების მინიჭების განახლება ვერ მოხერხდა");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            ქვე-კატეგორიების მინიჭება ბრენდზე და კატეგორიაზე
          </DialogTitle>
          <DialogDescription>
            აირჩიეთ ბრენდი, კატეგორია და ქვე-კატეგორიები მინიჭებისთვის
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
            <Label htmlFor="assign-category-select">კატეგორიის არჩევა</Label>
            <Select
              value={selectedCategoryForAssign}
              onValueChange={setSelectedCategoryForAssign}
              disabled={!selectedBrandForAssign}
            >
              <SelectTrigger id="assign-category-select">
                <SelectValue placeholder="აირჩიეთ კატეგორია" />
              </SelectTrigger>
              <SelectContent>
                {categoriesForBrand?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name.en}
                  </SelectItem>
                ))}
                {selectedBrandForAssign && categoriesForBrand?.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    ამ ბრენდისთვის კატეგორიები არ არის ხელმისაწვდომი
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Child Categories Selection */}
          <div className="space-y-2">
            <Label>ქვე-კატეგორიების არჩევა</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-4">
              {childCategories.map((childCategory) => {
                const isAssigned = assignedChildCategoryIds.includes(
                  childCategory._id
                );
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
                            უკვე მინიჭებულია
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
              {childCategories.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  ქვე-კატეგორიები არ არის ხელმისაწვდომი
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
            გაუქმება
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={
              !selectedBrandForAssign ||
              !selectedCategoryForAssign ||
              setChildCategoryGroup.isPending ||
              !hasChanges
            }
          >
            {setChildCategoryGroup.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                მინიჭება მიმდინარეობს...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                მინიჭება ({selectedChildCategoryIds.length} ქვე-კატეგორია)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
