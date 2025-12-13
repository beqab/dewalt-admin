"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewsTable } from "@/features/news/components/news-table"
import { NewsFormDialog } from "@/features/news/components/news-form-dialog"
import type { News, CreateNewsDto, UpdateNewsDto } from "@/features/news/types"
import { dummyNews } from "@/features/news/data/dummy-news"

export default function NewsPage() {
  const [news, setNews] = useState<News[]>(dummyNews)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | undefined>()

  const handleCreate = () => {
    setEditingNews(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: News) => {
    setEditingNews(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      // TODO: Implement API call
      setNews(news.filter((n) => n.id !== id))
    }
  }

  const handleSubmit = async (data: CreateNewsDto | UpdateNewsDto) => {
    // TODO: Implement API call
    if (editingNews) {
      setNews(
        news.map((n) =>
          n.id === editingNews.id ? { ...n, ...data } : n
        )
      )
    } else {
      const newNews: News = {
        id: Date.now().toString(),
        ...(data as CreateNewsDto),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNews([...news, newNews])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">News</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage news articles</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add News
        </Button>
      </div>

      <NewsTable
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewsFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        news={editingNews}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

