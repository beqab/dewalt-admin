"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BannerSliderTable } from "@/features/bannerSlider/components/banner-slider-table"
import { BannerSliderFormDialog } from "@/features/bannerSlider/components/banner-slider-form-dialog"
import type {
  BannerSlide,
  CreateBannerSlideDto,
  UpdateBannerSlideDto,
} from "@/features/bannerSlider/types"
import { dummyBannerSlides } from "@/features/bannerSlider/data/dummy-banner-slides"

export default function BannerSliderPage() {
  const [slides, setSlides] = useState<BannerSlide[]>(dummyBannerSlides)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<BannerSlide | undefined>()

  const handleCreate = () => {
    setEditingSlide(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (slide: BannerSlide) => {
    setEditingSlide(slide)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner slide?")) {
      // TODO: Implement API call
      setSlides(slides.filter((s) => s.id !== id))
    }
  }

  const handleSubmit = async (
    data: CreateBannerSlideDto | UpdateBannerSlideDto
  ) => {
    // TODO: Implement API call
    if (editingSlide) {
      setSlides(
        slides.map((s) =>
          s.id === editingSlide.id ? { ...s, ...data } : s
        )
      )
    } else {
      const newSlide: BannerSlide = {
        id: Date.now().toString(),
        ...(data as CreateBannerSlideDto),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSlides([...slides, newSlide])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Banner Slider</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage banner slider slides</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </Button>
      </div>

      <BannerSliderTable
        slides={slides}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BannerSliderFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        slide={editingSlide}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

