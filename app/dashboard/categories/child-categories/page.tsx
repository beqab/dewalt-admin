"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { ChildCategoriesTable } from "@/features/categories/components/child-categories-table";
import {
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
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function ChildCategoriesPage() {
  const searchParams = useSearchParams();
  const categoryIdFromQuery = searchParams.get("categoryId");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChildCategory, setEditingChildCategory] = useState<
    ChildCategory | undefined
  >();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryIdFromQuery || ""
  );

  const { data: categories } = useGetCategories();
  const {
    data: childCategories,
    isLoading,
    error,
  } = useGetChildCategories(selectedCategoryId || undefined);
  const createChildCategory = useCreateChildCategory();
  const updateChildCategory = useUpdateChildCategory();
  const deleteChildCategory = useDeleteChildCategory();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
    categoryId: selectedCategoryId,
  });

  useEffect(() => {
    if (categoryIdFromQuery) {
      setSelectedCategoryId(categoryIdFromQuery);
      setFormData((prev) => ({ ...prev, categoryId: categoryIdFromQuery }));
    }
  }, [categoryIdFromQuery]);

  useEffect(() => {
    if (selectedCategoryId) {
      setFormData((prev) => ({ ...prev, categoryId: selectedCategoryId }));
    }
  }, [selectedCategoryId]);

  const handleCreate = () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }
    setEditingChildCategory(undefined);
    setFormData({
      name: { ka: "", en: "" },
      slug: "",
      categoryId: selectedCategoryId,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (childCategory: ChildCategory) => {
    setEditingChildCategory(childCategory);
    const categoryId =
      typeof childCategory.categoryId === "string"
        ? childCategory.categoryId
        : childCategory.categoryId._id;
    setFormData({
      name: childCategory.name,
      slug: childCategory.slug,
      categoryId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this child category?")) {
      deleteChildCategory.mutate(id);
    }
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
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (editingChildCategory) {
      updateChildCategory.mutate(
        {
          id: editingChildCategory._id,
          data: formData as UpdateChildCategoryDto,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createChildCategory.mutate(formData as CreateChildCategoryDto, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
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

  const selectedCategory = categories?.find(
    (c) => c._id === selectedCategoryId
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Child Categories</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage child categories for categories
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="w-full sm:w-auto"
          disabled={!selectedCategoryId}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Child Category
        </Button>
      </div>

      <div className="space-y-4">
        <div className="max-w-xs">
          <Label htmlFor="category-select">Filter by Category</Label>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {typeof category.brandId === "object" && category.brandId
                    ? `${category.name.en} (${category.brandId.name.en})`
                    : category.name.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategoryId ? (
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin" /> Loading child categories...
            </div>
          ) : selectedCategory ? (
            <ChildCategoriesTable
              childCategories={childCategories || []}
              category={selectedCategory}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChildCategory={handleCreate}
            />
          ) : null
        ) : (
          <div className="flex items-center justify-center h-64 border rounded-md">
            <p className="text-muted-foreground">
              Please select a category to view child categories
            </p>
          </div>
        )}
      </div>

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
                  : "Add a new child category."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="child-category-category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  disabled={!!editingChildCategory}
                >
                  <SelectTrigger id="child-category-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {typeof category.brandId === "object" &&
                        category.brandId
                          ? `${category.name.en} (${category.brandId.name.en})`
                          : category.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
    </div>
  );
}
