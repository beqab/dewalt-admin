"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { BannerSliderTable } from "@/features/bannerSlider/components/banner-slider-table";
import { BannerSliderFormDialog } from "@/features/bannerSlider/components/banner-slider-form-dialog";
import type {
  Banner,
  CreateBannerDto,
  UpdateBannerDto,
} from "@/features/bannerSlider/types";
import {
  useGetBannerSlider,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useReorderBanners,
} from "@/features/bannerSlider";

export default function BannerSliderPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>();

  const { data, isLoading, error } = useGetBannerSlider();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const reorderBanners = useReorderBanners();

  const banners = data?.banners || [];

  const handleCreate = () => {
    setEditingBanner(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: CreateBannerDto | UpdateBannerDto) => {
    if (editingBanner) {
      updateBanner.mutate(
        { order: editingBanner.order, data: data as UpdateBannerDto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            // Reset local banners to refetch from server
          },
        }
      );
    } else {
      createBanner.mutate(data as CreateBannerDto, {
        onSuccess: () => {
          setIsDialogOpen(false);
          // Reset local banners to refetch from server
        },
      });
    }
  };

  const handleReorder = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    if (direction === "up") {
      [newBanners[index - 1], newBanners[index]] = [
        newBanners[index],
        newBanners[index - 1],
      ];
    } else {
      [newBanners[index], newBanners[index + 1]] = [
        newBanners[index + 1],
        newBanners[index],
      ];
    }

    // Update order based on new position
    const updatedBanners = newBanners.map((banner, idx) => ({
      ...banner,
      order: idx,
    }));

    // Remove order from banners (backend will assign based on array position)
    const bannersWithoutOrder = updatedBanners.map((b) => {
      const { order, ...rest } = b;
      void order;
      return rest;
    });
    reorderBanners.mutate({ banners: bannersWithoutOrder });
  };

  const handleDelete = async (order: number) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ ბანერის წაშლა?")) {
      deleteBanner.mutate(order);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          ბანერების ჩატვირთვის შეცდომა:{" "}
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
          <h1 className="text-2xl font-bold sm:text-3xl">ბანერ-სლაიდერი</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ბანერ-სლაიდერის მართვა
          </p>
        </div>
        <div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            ბანერის დამატება
          </Button>
        </div>
      </div>

      <div className="relative">
        <BannerSliderTable
          banners={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          reorderBanners={handleReorder}
        />
      </div>

      <BannerSliderFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        banner={editingBanner}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
