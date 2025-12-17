"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
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
  CreateCategoryDto,
  UpdateCategoryDto,
  Brand,
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
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoriesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandIdFromQuery = searchParams.get("brandId");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    brandIdFromQuery || ""
  );

  const { data: brands } = useGetBrands();
  const {
    data: categories,
    isLoading,
    error,
  } = useGetCategories(selectedBrandId || undefined);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
    brandId: brandIdFromQuery || "",
  });

  useEffect(() => {
    if (brandIdFromQuery) {
      setSelectedBrandId(brandIdFromQuery);
      setFormData((prev) => ({ ...prev, brandId: brandIdFromQuery }));
    }
  }, [brandIdFromQuery]);

  useEffect(() => {
    if (selectedBrandId) {
      setFormData((prev) => ({ ...prev, brandId: selectedBrandId }));
    }
  }, [selectedBrandId]);

  const handleCreate = () => {
    if (!selectedBrandId) {
      toast.error("Please select a brand first");
      return;
    }
    setEditingCategory(undefined);
    setFormData({
      name: { ka: "", en: "" },
      slug: "",
      brandId: selectedBrandId,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    const brandId =
      typeof category.brandId === "string"
        ? category.brandId
        : category.brandId._id;
    setFormData({
      name: category.name,
      slug: category.slug,
      brandId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleManageChildCategories = (categoryId: string) => {
    router.push(
      `/dashboard/categories/child-categories?categoryId=${categoryId}`
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
    if (!formData.brandId) {
      toast.error("Please select a brand");
      return;
    }

    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory._id, data: formData as UpdateCategoryDto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createCategory.mutate(formData as CreateCategoryDto, {
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
          Error loading categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const selectedBrand = brands?.find((b) => b._id === selectedBrandId);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage categories for brands
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="w-full sm:w-auto"
          disabled={!selectedBrandId}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="space-y-4">
        <div className="max-w-xs">
          <Label htmlFor="brand-select">Filter by Brand</Label>
          <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
            <SelectTrigger id="brand-select">
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

        {selectedBrandId ? (
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin" /> Loading categories...
            </div>
          ) : (
            <CategoriesTable
              categories={categories || []}
              brand={selectedBrand!}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddCategory={handleCreate}
              onManageChildCategories={handleManageChildCategories}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-64 border rounded-md">
            <p className="text-muted-foreground">
              Please select a brand to view categories
            </p>
          </div>
        )}
      </div>

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
                  : "Add a new category."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-brand">Brand</Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, brandId: value })
                  }
                  disabled={!!editingCategory}
                >
                  <SelectTrigger id="category-brand">
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
    </div>
  );
}
