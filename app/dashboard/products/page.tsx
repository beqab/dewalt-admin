"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductsTable } from "@/features/products/components/products-table"
import { ProductFormDialog } from "@/features/products/components/product-form-dialog"
import type { Product, CreateProductDto, UpdateProductDto } from "@/features/products/types"
import { dummyProducts } from "@/features/products/data/dummy-products"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(dummyProducts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  const handleCreate = () => {
    setEditingProduct(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // TODO: Implement API call
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    // TODO: Implement API call
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...data } : p
        )
      )
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...(data as CreateProductDto),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage products and inventory</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

