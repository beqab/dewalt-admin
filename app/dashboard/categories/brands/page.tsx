"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { BrandsTable } from "@/features/categories/components/brands-table";
import {
  useGetBrands,
  useDeleteBrand,
  useCreateBrand,
  useUpdateBrand,
} from "@/features/categories";
import type {
  Brand,
  CreateBrandDto,
  UpdateBrandDto,
} from "@/features/categories/types";
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
import { useRouter } from "next/navigation";

export default function BrandsPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>();

  const { data: brands, isLoading, error } = useGetBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [formData, setFormData] = useState({
    name: { ka: "", en: "" },
    slug: "",
  });

  const handleCreate = () => {
    setEditingBrand(undefined);
    setFormData({
      name: { ka: "", en: "" },
      slug: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      deleteBrand.mutate(id);
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

    if (editingBrand) {
      updateBrand.mutate(
        { id: editingBrand._id, data: formData as UpdateBrandDto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createBrand.mutate(formData as CreateBrandDto, {
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
          Error loading brands:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Brands</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage brands and their categories
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <BrandsTable
        brands={brands || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageCategories={(brand) => {
          router.push(`/dashboard/categories/categories?brandId=${brand._id}`);
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Create Brand"}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? "Update brand information."
                  : "Add a new brand."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="name-ka"
                      className="text-sm text-muted-foreground"
                    >
                      Georgian (ქართული)
                    </Label>
                    <Input
                      id="name-ka"
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
                      htmlFor="name-en"
                      className="text-sm text-muted-foreground"
                    >
                      English
                    </Label>
                    <Input
                      id="name-en"
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
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="dewalt"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (lowercase, no spaces, use hyphens)
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
                disabled={createBrand.isPending || updateBrand.isPending}
              >
                {createBrand.isPending || updateBrand.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingBrand ? "Updating..." : "Creating..."}
                  </>
                ) : editingBrand ? (
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
