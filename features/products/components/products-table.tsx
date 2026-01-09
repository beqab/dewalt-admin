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
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types";
import Image from "next/image";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name (EN / KA)</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const brandName =
                  typeof product.brandId === "string"
                    ? "-"
                    : product.brandId.name.en;
                const categoryName =
                  typeof product.categoryId === "string"
                    ? "-"
                    : product.categoryId.name.en;

                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name.en}
                          fill
                          className="object-fit"
                          sizes="96px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {product.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.name.ka}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{product.code}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {product.price} GEL
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            {product.originalPrice} GEL
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <div className="text-xs text-destructive">
                          -{product.discount}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{brandName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{categoryName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "default" : "outline"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.rating} ({product.reviewCount} reviews)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product._id)}
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
