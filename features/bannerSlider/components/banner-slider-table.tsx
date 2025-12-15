"use client";

import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Banner } from "../types";

interface BannerSliderTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (order: number) => void;
  reorderBanners: (id: number, order: "up" | "down") => void;
}

export function BannerSliderTable({
  banners,
  onEdit,
  onDelete,
  reorderBanners,
}: BannerSliderTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Title (EN / KA)</TableHead>
              <TableHead>Description (EN / KA)</TableHead>
              <TableHead className="w-32">Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No banners found.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner, index) => (
                <TableRow key={banner.order}>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium text-xs">{index + 1}</span>
                      <div className="flex flex-col gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => reorderBanners(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => reorderBanners(index, "down")}
                          disabled={index === banners.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {banner.title.en}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {banner.title.ka}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      <div className="text-sm truncate">
                        {banner.description.en}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {banner.description.ka}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title.en || "Banner image"}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(banner)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(banner.order)}
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
  );
}
