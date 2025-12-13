"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AdsTable } from "@/features/ads/components/ads-table"
import { AdFormDialog } from "@/features/ads/components/ad-form-dialog"
import type { Ad, CreateAdDto, UpdateAdDto } from "@/features/ads/types"
import { dummyAds } from "@/features/ads/data/dummy-ads"

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>(dummyAds)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | undefined>()

  const handleCreate = () => {
    setEditingAd(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      // TODO: Implement API call
      setAds(ads.filter((a) => a.id !== id))
    }
  }

  const handleSubmit = async (data: CreateAdDto | UpdateAdDto) => {
    // TODO: Implement API call
    if (editingAd) {
      setAds(
        ads.map((a) =>
          a.id === editingAd.id ? { ...a, ...data } : a
        )
      )
    } else {
      const newAd: Ad = {
        id: Date.now().toString(),
        ...(data as CreateAdDto),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setAds([...ads, newAd])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Ads</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage advertisements</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Ad
        </Button>
      </div>

      <AdsTable
        ads={ads}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ad={editingAd}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

