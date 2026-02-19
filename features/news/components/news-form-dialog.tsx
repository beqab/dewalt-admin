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
import type { News, CreateNewsDto, UpdateNewsDto } from "../types"

interface NewsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news?: News
  onSubmit: (data: CreateNewsDto | UpdateNewsDto) => void
}

export function NewsFormDialog({
  open,
  onOpenChange,
  news,
  onSubmit,
}: NewsFormDialogProps) {
  const [formData, setFormData] = useState({
    title: { en: "", ka: "" },
    summary: { en: "", ka: "" },
    content: { en: "", ka: "" },
    imageUrl: "",
  })

  useEffect(() => {
    if (news) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: news.title,
        content: news.content,
        summary: news.summary,
        imageUrl: news.imageUrl,
      })
    } else {
      setFormData({
        title: { en: "", ka: "" },
        summary: { en: "", ka: "" },
        content: { en: "", ka: "" },
        imageUrl: "",
      })
    }
  }, [news, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as CreateNewsDto | UpdateNewsDto)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{news ? "სიახლის რედაქტირება" : "სიახლის შექმნა"}</DialogTitle>
            <DialogDescription>
              {news
                ? "სიახლის ინფორმაციის განახლება."
                : "ახალი სიახლის დამატება."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title-en">სათაური (EN)</Label>
                <Input
                  id="title-en"
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, en: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title-ka">სათაური (KA)</Label>
                <Input
                  id="title-ka"
                  value={formData.title.ka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, ka: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="summary-en">შეჯამება (EN)</Label>
                <Textarea
                  id="summary-en"
                  value={formData.summary.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      summary: { ...formData.summary, en: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="summary-ka">შეჯამება (KA)</Label>
                <Textarea
                  id="summary-ka"
                  value={formData.summary.ka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      summary: { ...formData.summary, ka: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="content-en">შინაარსი (EN)</Label>
                <Textarea
                  id="content-en"
                  rows={8}
                  value={formData.content.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, en: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content-ka">შინაარსი (KA)</Label>
                <Textarea
                  id="content-ka"
                  rows={8}
                  value={formData.content.ka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, ka: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">სურათის URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              გაუქმება
            </Button>
            <Button type="submit">
              {news ? "განახლება" : "შექმნა"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
