"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category, Brand } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  brand: Brand;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAddCategory: (brandId: string) => void;
  onManageChildCategories: (categoryId: string) => void;
}

export function CategoriesTable({
  categories,
  brand,
  onEdit,
  onDelete,
  onAddCategory,
  onManageChildCategories,
}: CategoriesTableProps) {
  const brandName = typeof brand === "string" ? "" : brand.name.en;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories for {brandName}</h3>
        <Button
          onClick={() => onAddCategory(typeof brand === "string" ? brand : brand._id)}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (EN / KA)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-32">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
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
                      <div className="text-xs text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManageChildCategories(category._id)}
                        >
                          Manage Children
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(category)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(category._id)}
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
    </div>
  );
}

