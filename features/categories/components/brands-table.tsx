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
import type { Brand } from "../types";

interface BrandsTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export function BrandsTable({ brands, onEdit, onDelete }: BrandsTableProps) {
  return (
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
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No brands found.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{brand.name.en}</div>
                      <div className="text-xs text-muted-foreground">
                        {brand.name.ka}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">{brand.slug}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(brand)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(brand._id)}
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
