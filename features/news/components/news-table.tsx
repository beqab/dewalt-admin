"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
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
import type { News } from "../types";
import { useRouter } from "next/navigation";

interface NewsTableProps {
  news: News[];
  onDelete: (id: string) => void;
}

export function NewsTable({ news, onDelete }: NewsTableProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/news/${id}/edit`);
  };

  const handlePreview = (id: string) => {
    router.push(`/dashboard/news/${id}/preview`);
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Image</TableHead>
              <TableHead>Title (EN / KA)</TableHead>
              <TableHead>Summary (EN / KA)</TableHead>
              <TableHead className="w-32">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No news articles found.
                </TableCell>
              </TableRow>
            ) : (
              news.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>
                    <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
                      <Image
                        src={article.imageUrl}
                        alt={article.title.en || "News image"}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {article.title.en}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {article.title.ka}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      <div className="text-sm truncate">
                        {article.summary.en}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {article.summary.ka}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(article._id)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(article._id)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(article._id)}
                        title="Delete"
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
