"use client"

import { useState } from "react"
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
import type { Ad, AdPosition, CreateAdDto, UpdateAdDto } from "../types"

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
  const getInitialFormData = (currentAd?: Ad) => ({
    imageUrl: currentAd?.imageUrl || "",
    urlLink: currentAd?.urlLink || "",
    position: currentAd?.position || ("" as AdPosition | ""),
  })

  const [formData, setFormData] = useState(() => getInitialFormData(ad))
  const formKey = `${ad?._id ?? "new"}-${open ? "open" : "closed"}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      urlLink: formData.urlLink || undefined,
    }
    onSubmit(submitData as CreateAdDto | UpdateAdDto)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form key={formKey} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{ad ? "Edit Ad" : "Create Ad"}</DialogTitle>
            <DialogDescription>
              {ad ? "Update ad information." : "Add a new ad."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="urlLink">Link (optional)</Label>
              <Input
                id="urlLink"
                value={formData.urlLink}
                onChange={(e) =>
                  setFormData({ ...formData, urlLink: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) =>
                  setFormData({ ...formData, position: value as AdPosition })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main_page">Main Page</SelectItem>
                  <SelectItem value="aside">Aside</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
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

