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
import type { ChildCategory, Category } from "../types";

interface ChildCategoriesTableProps {
  childCategories: ChildCategory[];
  category: Category;
  onEdit: (childCategory: ChildCategory) => void;
  onDelete: (id: string) => void;
  onAddChildCategory: (categoryId: string) => void;
}

export function ChildCategoriesTable({
  childCategories,
  category,
  onEdit,
  onDelete,
  onAddChildCategory,
}: ChildCategoriesTableProps) {
  const categoryName =
    typeof category === "string" ? "" : category.name.en;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Child Categories for {categoryName}
        </h3>
        <Button
          onClick={() =>
            onAddChildCategory(typeof category === "string" ? category : category._id)
          }
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Child Category
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
              {childCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No child categories found.
                  </TableCell>
                </TableRow>
              ) : (
                childCategories.map((childCategory) => (
                  <TableRow key={childCategory._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {childCategory.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {childCategory.name.ka}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">
                        {childCategory.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {new Date(childCategory.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(childCategory)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(childCategory._id)}
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

