"use client"

import { Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BannerSlide } from "../types"

interface BannerSliderTableProps {
  slides: BannerSlide[]
  onEdit: (slide: BannerSlide) => void
  onDelete: (id: string) => void
}

export function BannerSliderTable({
  slides,
  onEdit,
  onDelete,
}: BannerSliderTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No banner slides found.
              </TableCell>
            </TableRow>
          ) : (
            slides
              .sort((a, b) => a.order - b.order)
              .map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell className="font-medium">{slide.order}</TableCell>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell>
                    <Badge variant={slide.isActive ? "default" : "outline"}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(slide.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(slide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(slide.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

