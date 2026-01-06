"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import {
  CategoriesTable,
  CategoryForm,
  AssignToBrandDialog,
  BrandSelector,
} from "@/features/categories";
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
} from "@/features/categories/types";
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

  const { data: brands } = useGetBrands();
  const { data: categories, isLoading, error } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleManageChildCategories = (category: Category) => {
    window.location.href = `/dashboard/categories/child-categories?categoryId=${category._id}`;
  };

  const handleOpenAssignDialog = () => {
    if (!selectedBrandForAssign) {
      toast.error("Please select a brand first");
      return;
    }
    setIsAssignDialogOpen(true);
  };

  const handleCreateCategory = async (data: CreateCategoryDto) => {
    await createCategory.mutateAsync(data);
  };

  const handleUpdateCategory = async (id: string, data: UpdateCategoryDto) => {
    await updateCategory.mutateAsync({ id, data });
  };

  const selectedBrand = brands?.find((b) => b._id === selectedBrandForAssign);

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
            <BrandSelector
              brands={brands}
              value={selectedBrandForAssign}
              onValueChange={setSelectedBrandForAssign}
              id="brand-select-assign"
            />
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
      <CategoryForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        category={editingCategory}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        isCreating={createCategory.isPending}
        isUpdating={updateCategory.isPending}
      />

      {/* Assign Categories to Brand Dialog */}
      {selectedBrand && (
        <AssignToBrandDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          brandId={selectedBrandForAssign}
          brandName={selectedBrand.name.en}
          categories={categories || []}
        />
      )}
    </div>
  );
}
