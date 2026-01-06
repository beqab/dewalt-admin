"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import { CategoriesTable } from "@/features/categories/components/categories-table";
import {
  useGetBrands,
  useGetCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories";
import type {
  Category,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
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

export default function CategoriesListPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [selectedBrandForAssign, setSelectedBrandForAssign] =
    useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const { data: brands } = useGetBrands();
  const { data: categories, isLoading, error } = useGetCategories(); // Get all categories without brand filter
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
  });

  const handleCreate = () => {
    setEditingCategory(undefined);
    setFormData({
      name: { ka: "", en: "" },
      slug: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleManageChildCategories = (category: Category) => {
    // Navigate to child categories page
    window.location.href = `/dashboard/categories/child-categories?categoryId=${category._id}`;
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

    if (editingCategory) {
      // For update, only update name and slug, not brandIds
      const { ...updateData } = formData;
      updateCategory.mutate(
        { id: editingCategory._id, data: updateData as UpdateCategoryDto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      // For create, brandIds is optional
      createCategory.mutate(formData as CreateCategoryDto, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleOpenAssignDialog = () => {
    if (!selectedBrandForAssign) {
      toast.error("Please select a brand first");
      return;
    }
    // Pre-select categories that are already assigned to this brand
    const preSelectedCategories =
      categories
        ?.filter((cat) => {
          const brandIds = Array.isArray(cat.brandIds)
            ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
            : [];
          return brandIds.includes(selectedBrandForAssign);
        })
        .map((cat) => cat._id) || [];
    setSelectedCategoryIds(preSelectedCategories);
    setIsAssignDialogOpen(true);
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAssignBrands = async () => {
    if (!selectedBrandForAssign) {
      toast.error("Please select a brand");
      return;
    }

    // Get all categories (both selected and previously assigned)
    const allCategories = categories || [];
    const previouslyAssignedCategoryIds = allCategories
      .filter((cat) => {
        const brandIds = Array.isArray(cat.brandIds)
          ? cat.brandIds.map((b) => (typeof b === "string" ? b : b._id))
          : [];
        return brandIds.includes(selectedBrandForAssign);
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

    const updatePromises: Promise<CategoryResponse>[] = [];

    // Add brand to new categories
    categoriesToAdd.forEach((categoryId) => {
      const category = categories?.find((c) => c._id === categoryId);
      if (!category) return;

      const currentBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.includes(selectedBrandForAssign)
        ? currentBrandIds
        : [...currentBrandIds, selectedBrandForAssign];

      updatePromises.push(
        updateCategory.mutateAsync({
          id: categoryId,
          data: { brandIds: newBrandIds } as UpdateCategoryDto,
        })
      );
    });

    // Remove brand from unselected categories
    categoriesToRemove.forEach((categoryId) => {
      const category = categories?.find((c) => c._id === categoryId);
      if (!category) return;

      const currentBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];

      const newBrandIds = currentBrandIds.filter(
        (id) => id !== selectedBrandForAssign
      );

      updatePromises.push(
        updateCategory.mutateAsync({
          id: categoryId,
          data: { brandIds: newBrandIds } as UpdateCategoryDto,
        })
      );
    });

    if (updatePromises.length === 0) {
      toast.info("No changes to apply");
      setIsAssignDialogOpen(false);
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
      setIsAssignDialogOpen(false);
      setSelectedCategoryIds([]);
      setSelectedBrandForAssign("");
    } catch (error) {
      toast.error("Failed to update category assignments");
      console.error("Error:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage categories and assign them to brands
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleOpenAssignDialog}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={!selectedBrandForAssign}
          >
            <Save className="mr-2 h-4 w-4" />
            Assign to Brand
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Brand Selection for Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Categories to Brand</CardTitle>
          <CardDescription>
            Select a brand to assign categories to it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="brand-select-assign">Select Brand</Label>
            <Select
              value={selectedBrandForAssign}
              onValueChange={setSelectedBrandForAssign}
            >
              <SelectTrigger id="brand-select-assign">
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
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" /> Loading categories...
        </div>
      ) : (
        <CategoriesTable
          categories={categories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageChildCategories={handleManageChildCategories}
        />
      )}

      {/* Create/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {createCategory.isPending || updateCategory.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingCategory ? "Updating..." : "Creating..."}
                  </>
                ) : editingCategory ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Categories to Brand Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Categories to Brand</DialogTitle>
            <DialogDescription>
              Select categories to assign to{" "}
              {brands?.find((b) => b._id === selectedBrandForAssign)?.name.en ||
                "selected brand"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {categories?.map((category) => {
              const categoryBrandIds = Array.isArray(category.brandIds)
                ? category.brandIds.map((b) =>
                    typeof b === "string" ? b : b._id
                  )
                : [];
              const isAssigned = categoryBrandIds.includes(
                selectedBrandForAssign
              );
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
            {categories?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No categories available
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAssignBrands}
              disabled={
                selectedCategoryIds.length === 0 || updateCategory.isPending
              }
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
    </div>
  );
}
