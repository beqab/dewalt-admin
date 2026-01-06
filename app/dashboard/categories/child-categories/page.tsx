"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import { ChildCategoriesTable } from "@/features/categories/components/child-categories-table";
import {
  useGetBrands,
  useGetCategories,
  useGetChildCategories,
  useDeleteChildCategory,
  useCreateChildCategory,
  useUpdateChildCategory,
} from "@/features/categories";
import type {
  ChildCategory,
  CreateChildCategoryDto,
  UpdateChildCategoryDto,
  Brand,
  Category,
} from "@/features/categories/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChildCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [
    isAssignToBrandCategoryDialogOpen,
    setIsAssignToBrandCategoryDialogOpen,
  ] = useState(false);
  const [isAssignBrandsDialogOpen, setIsAssignBrandsDialogOpen] =
    useState(false);
  const [editingChildCategory, setEditingChildCategory] = useState<
    ChildCategory | undefined
  >();
  const [selectedBrandForAssign, setSelectedBrandForAssign] =
    useState<string>("");
  const [selectedCategoryForAssign, setSelectedCategoryForAssign] =
    useState<string>("");
  const [selectedChildCategoryIds, setSelectedChildCategoryIds] = useState<
    string[]
  >([]);
  const [
    selectedChildCategoryForBrandAssign,
    setSelectedChildCategoryForBrandAssign,
  ] = useState<ChildCategory | null>(null);
  const [selectedBrandIdsForAssign, setSelectedBrandIdsForAssign] = useState<
    string[]
  >([]);

  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();
  const { data: childCategories, isLoading, error } = useGetChildCategories(); // Get all child categories
  const createChildCategory = useCreateChildCategory();
  const updateChildCategory = useUpdateChildCategory();
  const deleteChildCategory = useDeleteChildCategory();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
    brandIds: [] as string[],
    categoryId: undefined as string | undefined,
  });

  // Filter categories by selected brand
  const categoriesForBrand = selectedBrandForAssign
    ? categories?.filter((cat) => {
        const brandIds = Array.isArray(cat.brandIds)
          ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
          : [];
        return brandIds.includes(selectedBrandForAssign);
      })
    : categories;

  useEffect(() => {
    if (selectedBrandForAssign && selectedCategoryForAssign) {
      const category = categoriesForBrand?.find(
        (c) => c._id === selectedCategoryForAssign
      );
      if (!category) {
        setSelectedCategoryForAssign("");
      }
    }
  }, [selectedBrandForAssign, categoriesForBrand, selectedCategoryForAssign]);

  const handleCreate = () => {
    setEditingChildCategory(undefined);
    setFormData({
      name: { ka: "", en: "" },
      slug: "",
      brandIds: [],
      categoryId: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (childCategory: ChildCategory) => {
    setEditingChildCategory(childCategory);
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
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this child category?")) {
      deleteChildCategory.mutate(id);
    }
  };

  const handleOpenAssignToBrandCategoryDialog = () => {
    setSelectedBrandForAssign("");
    setSelectedCategoryForAssign("");
    setSelectedChildCategoryIds([]);
    setIsAssignToBrandCategoryDialogOpen(true);
  };

  // Update selected child categories when brand and category are selected
  useEffect(() => {
    if (selectedBrandForAssign && selectedCategoryForAssign && childCategories) {
      // Pre-select child categories that are already assigned to this brand + category combination
      const preSelectedChildCategories = childCategories
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
      setSelectedChildCategoryIds(preSelectedChildCategories);
    } else {
      setSelectedChildCategoryIds([]);
    }
  }, [selectedBrandForAssign, selectedCategoryForAssign, childCategories]);

  const handleAssignBrands = (childCategory: ChildCategory) => {
    setSelectedChildCategoryForBrandAssign(childCategory);
    // Pre-select current brandIds
    const currentBrandIds = Array.isArray(childCategory.brandIds)
      ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
      : [];
    setSelectedBrandIdsForAssign(currentBrandIds);
    setIsAssignBrandsDialogOpen(true);
  };

  const handleToggleBrand = (brandId: string) => {
    setSelectedBrandIdsForAssign((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleToggleChildCategory = (childCategoryId: string) => {
    setSelectedChildCategoryIds((prev) =>
      prev.includes(childCategoryId)
        ? prev.filter((id) => id !== childCategoryId)
        : [...prev, childCategoryId]
    );
  };

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

    if (editingChildCategory) {
      // For update, include brandIds and categoryId
      const updateData: UpdateChildCategoryDto = {
        name: formData.name,
        slug: formData.slug,
        brandIds: formData.brandIds,
        categoryId: formData.categoryId || undefined,
      };
      updateChildCategory.mutate(
        {
          id: editingChildCategory._id,
          data: updateData,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      // For create, include brandIds and categoryId if provided
      createChildCategory.mutate(formData as CreateChildCategoryDto, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleAssignToBrandAndCategory = async () => {
    if (!selectedBrandForAssign || !selectedCategoryForAssign) {
      toast.error("Please select both brand and category");
      return;
    }

    // Get all child categories (both selected and previously assigned)
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

    // Child categories to add brand + category to
    const childCategoriesToAdd = selectedChildCategoryIds.filter(
      (id) => !previouslyAssignedChildCategoryIds.includes(id)
    );

    // Child categories to remove brand + category from
    const childCategoriesToRemove = previouslyAssignedChildCategoryIds.filter(
      (id) => !selectedChildCategoryIds.includes(id)
    );

    const updatePromises: Promise<any>[] = [];

    // Add brand and category to new child categories
    childCategoriesToAdd.forEach((childCategoryId) => {
      const childCategory = childCategories?.find(
        (c) => c._id === childCategoryId
      );
      if (!childCategory) return;

      const currentBrandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      // Add selected brand if not already present
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
      const childCategory = childCategories?.find(
        (c) => c._id === childCategoryId
      );
      if (!childCategory) return;

      const currentBrandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      // Remove selected brand from brandIds array
      const newBrandIds = currentBrandIds.filter(
        (id) => id !== selectedBrandForAssign
      );

      // If no brands left, also remove categoryId
      const updateData: UpdateChildCategoryDto = {
        brandIds: newBrandIds,
      };
      if (newBrandIds.length === 0) {
        updateData.categoryId = undefined;
      } else {
        // Keep categoryId if there are still other brands
        const currentCategoryId =
          typeof childCategory.categoryId === "string"
            ? childCategory.categoryId
            : childCategory.categoryId?._id;
        if (currentCategoryId === selectedCategoryForAssign) {
          // Only remove categoryId if this was the only brand for this category
          // Otherwise keep it
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
      setIsAssignToBrandCategoryDialogOpen(false);
      return;
    }

    try {
      await Promise.all(updatePromises);
      const addCount = childCategoriesToAdd.length;
      const removeCount = childCategoriesToRemove.length;
      const message = [];
      if (addCount > 0)
        message.push(`Added ${addCount} child categor${addCount > 1 ? "ies" : "y"}`);
      if (removeCount > 0)
        message.push(`Removed ${removeCount} child categor${removeCount > 1 ? "ies" : "y"}`);
      toast.success(`Successfully updated: ${message.join(", ")}`);
      setIsAssignToBrandCategoryDialogOpen(false);
      setSelectedBrandForAssign("");
      setSelectedCategoryForAssign("");
      setSelectedChildCategoryIds([]);
    } catch (error) {
      toast.error("Failed to update child category assignments");
      console.error("Error:", error);
    }
  };

  const handleSaveBrandAssignments = async () => {
    if (!selectedChildCategoryForBrandAssign) {
      toast.error("No child category selected");
      return;
    }

    if (selectedBrandIdsForAssign.length === 0) {
      toast.error("Please select at least one brand");
      return;
    }

    updateChildCategory.mutate(
      {
        id: selectedChildCategoryForBrandAssign._id,
        data: {
          brandIds: selectedBrandIdsForAssign,
        } as UpdateChildCategoryDto,
      },
      {
        onSuccess: () => {
          toast.success("Brands assigned successfully");
          setIsAssignBrandsDialogOpen(false);
          setSelectedChildCategoryForBrandAssign(null);
          setSelectedBrandIdsForAssign([]);
        },
      }
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading child categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Child Categories</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage child categories independently, then assign to brands and
            categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleOpenAssignToBrandCategoryDialog}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Assign to Brand + Category
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Child Category
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" /> Loading child categories...
        </div>
      ) : (
        <ChildCategoriesTable
          childCategories={childCategories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignBrands={handleAssignBrands}
        />
      )}

      {/* Create/Edit Child Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingChildCategory
                  ? "Edit Child Category"
                  : "Create Child Category"}
              </DialogTitle>
              <DialogDescription>
                {editingChildCategory
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
              {editingChildCategory && formData.brandIds.length > 0 && (
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
              {editingChildCategory && (
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
                    {brands?.filter((brand) => !formData.brandIds.includes(brand._id)).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        All brands are assigned
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Current Category - Show and allow removal */}
              {editingChildCategory && formData.categoryId && (
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
              {editingChildCategory && (
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
                      {categories
                        ?.filter((category) => {
                          // If brands are selected, only show categories that belong to at least one of the selected brands
                          if (formData.brandIds.length > 0) {
                            const categoryBrandIds = Array.isArray(
                              category.brandIds
                            )
                              ? category.brandIds.map((b) =>
                                  typeof b === "string" ? b : b._id
                                )
                              : [];
                            return formData.brandIds.some((brandId) =>
                              categoryBrandIds.includes(brandId)
                            );
                          }
                          // If no brands selected, show all categories
                          return true;
                        })
                        .map((category) => (
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createChildCategory.isPending || updateChildCategory.isPending
                }
              >
                {createChildCategory.isPending ||
                updateChildCategory.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingChildCategory ? "Updating..." : "Creating..."}
                  </>
                ) : editingChildCategory ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Child Categories to Brand + Category Dialog */}
      <Dialog
        open={isAssignToBrandCategoryDialogOpen}
        onOpenChange={setIsAssignToBrandCategoryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Assign Child Categories to Brand + Category
            </DialogTitle>
            <DialogDescription>
              Select a brand, its category, and child categories to assign
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Brand Selection */}
            <div>
              <Label htmlFor="assign-brand-select">Select Brand</Label>
              <Select
                value={selectedBrandForAssign}
                onValueChange={(value) => {
                  setSelectedBrandForAssign(value);
                  setSelectedCategoryForAssign(""); // Reset category when brand changes
                }}
              >
                <SelectTrigger id="assign-brand-select">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div>
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
                  {selectedBrandForAssign &&
                    categoriesForBrand?.length === 0 && (
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
                {childCategories?.map((childCategory) => {
                  const childCategoryBrandIds = Array.isArray(childCategory.brandIds)
                    ? childCategory.brandIds.map((b) => (typeof b === "string" ? b : b._id))
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
                {childCategories?.length === 0 && (
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
                setIsAssignToBrandCategoryDialogOpen(false);
                setSelectedBrandForAssign("");
                setSelectedCategoryForAssign("");
                setSelectedChildCategoryIds([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAssignToBrandAndCategory}
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

      {/* Assign Additional Brands Dialog */}
      <Dialog
        open={isAssignBrandsDialogOpen}
        onOpenChange={setIsAssignBrandsDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Brands to Child Category</DialogTitle>
            <DialogDescription>
              Select multiple brands to assign to{" "}
              {selectedChildCategoryForBrandAssign?.name.en}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label>Select Brands (multiple selection)</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-4">
              {brands?.map((brand) => (
                <div
                  key={brand._id}
                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
                >
                  <Checkbox
                    id={`assign-brand-${brand._id}`}
                    checked={selectedBrandIdsForAssign.includes(brand._id)}
                    onCheckedChange={() => handleToggleBrand(brand._id)}
                  />
                  <Label
                    htmlFor={`assign-brand-${brand._id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {brand.name.en}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAssignBrandsDialogOpen(false);
                setSelectedChildCategoryForBrandAssign(null);
                setSelectedBrandIdsForAssign([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveBrandAssignments}
              disabled={
                selectedBrandIdsForAssign.length === 0 ||
                updateChildCategory.isPending
              }
            >
              {updateChildCategory.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save ({selectedBrandIdsForAssign.length} brand
                  {selectedBrandIdsForAssign.length > 1 ? "s" : ""})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
