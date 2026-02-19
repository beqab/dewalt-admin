"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>დასახელება (EN / KA)</TableHead>
              <TableHead>სლაგი</TableHead>
              <TableHead>ბრენდები</TableHead>

              <TableHead className="text-right">მოქმედებები</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  კატეგორიები ვერ მოიძებნა.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                const brandIds = Array.isArray(category.brandIds)
                  ? category.brandIds
                  : [];
                const brands = brandIds.map((b) =>
                  typeof b === "string" ? b : b
                );

                return (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {category.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.name.ka}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{category.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {brands.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {brandIds?.map((brand) => {
                              return (
                                <span
                                  key={brand._id}
                                  className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs"
                                >
                                  {brand.name.en}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            ბრენდი არ არის მინიჭებული
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(category)}
                          title="რედაქტირება"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(category._id)}
                          title="წაშლა"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
