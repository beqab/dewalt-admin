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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Ad, CreateAdDto, UpdateAdDto } from "../types"

interface AdFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ad?: Ad
  onSubmit: (data: CreateAdDto | UpdateAdDto) => void
}

export function AdFormDialog({
  open,
  onOpenChange,
  ad,
  onSubmit,
}: AdFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    position: "",
    isActive: true,
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title,
        image: ad.image,
        link: ad.link || "",
        position: ad.position,
        isActive: ad.isActive,
        startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
        endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
      })
    } else {
      setFormData({
        title: "",
        image: "",
        link: "",
        position: "",
        isActive: true,
        startDate: "",
        endDate: "",
      })
    }
  }, [ad, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      link: formData.link || undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    }
    onSubmit(submitData as CreateAdDto | UpdateAdDto)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{ad ? "Edit Ad" : "Create Ad"}</DialogTitle>
            <DialogDescription>
              {ad ? "Update ad information." : "Add a new ad."}
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
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {ad ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

