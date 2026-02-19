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
import { createSlug } from "@/lib/slugify";

export default function BrandsPage() {
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
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ ბრენდის წაშლა?")) {
      deleteBrand.mutate(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.ka || !formData.name.en) {
      toast.error("გთხოვთ შეავსოთ დასახელება ქართულად და ინგლისურად");
      return;
    }
    if (!formData.slug) {
      toast.error("გთხოვთ შეიყვანოთ სლაგი");
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

  const onBlurCapture = () => {
    setFormData({
      ...formData,
      slug: createSlug(formData.name.en || ""),
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          ბრენდების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> იტვირთება...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">ბრენდები</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            მართეთ ბრენდები და მათი კატეგორიები
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          ბრენდის დამატება
        </Button>
      </div>

      <BrandsTable
        brands={brands || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "ბრენდის რედაქტირება" : "ბრენდის შექმნა"}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? "ბრენდის ინფორმაციის განახლება."
                  : "ახალი ბრენდის დამატება."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>დასახელება</Label>
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
                      ინგლისურად
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
                <Label htmlFor="slug">სლაგი</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  // todo: add default value slug use slagify library to convert name to slug

                  onBlurCapture={onBlurCapture}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="dewalt"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-ზე გამოსაყენებელი იდენტიფიკატორი (მცირე ასოები, გამოტოვებების
                  გარეშე, გამოიყენეთ დეფისი)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                გაუქმება
              </Button>
              <Button
                type="submit"
                disabled={createBrand.isPending || updateBrand.isPending}
              >
                {createBrand.isPending || updateBrand.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingBrand ? "განახლება მიმდინარეობს..." : "შექმნა მიმდინარეობს..."}
                  </>
                ) : editingBrand ? (
                  "განახლება"
                ) : (
                  "შექმნა"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
