"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  BannerSlide,
  CreateBannerSlideDto,
  UpdateBannerSlideDto,
} from "../types"

interface BannerSliderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slide?: BannerSlide
  onSubmit: (data: CreateBannerSlideDto | UpdateBannerSlideDto) => void
}

export function BannerSliderFormDialog({
  open,
  onOpenChange,
  slide,
  onSubmit,
}: BannerSliderFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        description: slide.description || "",
        image: slide.image,
        link: slide.link || "",
        order: slide.order,
        isActive: slide.isActive,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        order: 0,
        isActive: true,
      })
    }
  }, [slide, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      description: formData.description || undefined,
      link: formData.link || undefined,
    }
    onSubmit(submitData as CreateBannerSlideDto | UpdateBannerSlideDto)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {slide ? "Edit Banner Slide" : "Create Banner Slide"}
            </DialogTitle>
            <DialogDescription>
              {slide
                ? "Update banner slide information."
                : "Add a new banner slide."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">Link (optional)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {slide ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

