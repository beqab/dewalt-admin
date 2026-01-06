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
import type { ChildCategory } from "../types";

interface ChildCategoriesTableProps {
  childCategories: ChildCategory[];
  onEdit: (childCategory: ChildCategory) => void;
  onDelete: (id: string) => void;
}

export function ChildCategoriesTable({
  childCategories,
  onEdit,
  onDelete,
}: ChildCategoriesTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name (EN / KA)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {childCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No child categories found.
                </TableCell>
              </TableRow>
            ) : (
              childCategories.map((childCategory) => {
                const category =
                  childCategory.categoryId &&
                  typeof childCategory.categoryId === "object"
                    ? childCategory.categoryId
                    : null;

                return (
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
                      {Array.isArray(childCategory.brandIds) &&
                      childCategory.brandIds.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {childCategory.brandIds.map((brand) => {
                            return (
                              <span
                                key={brand._id}
                                className="text-xs px-2 py-1 rounded bg-muted"
                              >
                                {brand.name.en}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {category ? (
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          {category.name.en}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      )}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
