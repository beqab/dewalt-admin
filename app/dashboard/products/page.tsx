"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductForm } from "@/features/products/components/product-form";
import { Pagination } from "@/components/pagination";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@/features/products/types";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/features/products";
import {
  useGetBrands,
  useGetCategories,
  useGetChildCategories,
} from "@/features/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const limit = 20;

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [childCategoryId, setChildCategoryId] = useState<string>("");

  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();
  const { data: childCategories } = useGetChildCategories(
    brandId || undefined,
    categoryId || undefined
  );

  const { data, isLoading, error } = useGetProducts({
    page,
    limit,
    brandId: brandId || undefined,
    categoryId: categoryId || undefined,
    childCategoryId: childCategoryId || undefined,
    search: search || undefined,
  });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const products = data?.data || [];

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ პროდუქტის წაშლა?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleCreateProduct = async (data: CreateProductDto) => {
    await createProduct.mutateAsync(data);
    setIsDialogOpen(false);
  };

  const handleUpdateProduct = async (id: string, data: UpdateProductDto) => {
    await updateProduct.mutateAsync({ id, data });
    setIsDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = () => {
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleFilterChange();
  };

  const handleBrandChange = (value: string) => {
    setBrandId(value);
    setCategoryId(""); // Reset category when brand changes
    setChildCategoryId(""); // Reset child category when brand changes
    handleFilterChange();
  };

  const handleCategoryChange = (value: string | undefined) => {
    setCategoryId(value || "");
    setChildCategoryId(""); // Reset child category when category changes
    handleFilterChange();
  };

  const handleChildCategoryChange = (value: string) => {
    setChildCategoryId(value);
    handleFilterChange();
  };

  const handleClearFilters = () => {
    setSearch("");
    setBrandId("");
    setCategoryId("");
    setChildCategoryId("");
    setPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return !!(search || brandId || categoryId || childCategoryId);
  }, [search, brandId, categoryId, childCategoryId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          პროდუქტების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>პროდუქტები</CardTitle>
              <CardDescription>
                მართეთ პროდუქციის კატალოგი. შექმენით, დაარედაქტირეთ და წაშალეთ
                პროდუქტები.
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              პროდუქტის დამატება
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">ძიება</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="მოძებნეთ პროდუქტები..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label htmlFor="brand-filter">ბრენდი</Label>
                <Select
                  value={brandId || undefined}
                  onValueChange={handleBrandChange}
                >
                  <SelectTrigger id="brand-filter">
                    <SelectValue placeholder="ყველა ბრენდი" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category-filter">კატეგორია</Label>
                <Select
                  value={categoryId || undefined}
                  onValueChange={(val) =>
                    handleCategoryChange(val || undefined)
                  }
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="ყველა კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      ?.filter((category) => {
                        if (brandId) {
                          const categoryBrandIds = Array.isArray(
                            category.brandIds
                          )
                            ? category.brandIds.map((b) =>
                                typeof b === "string" ? b : b._id
                              )
                            : [];
                          return categoryBrandIds.includes(brandId);
                        }
                        return true;
                      })
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name.en}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Child Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="childCategory">ქვე-კატეგორია</Label>
                <Select
                  value={childCategoryId || undefined}
                  onValueChange={handleChildCategoryChange}
                  disabled={!categoryId}
                >
                  <SelectTrigger id="childCategory">
                    <SelectValue placeholder="ყველა ქვე-კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    {childCategories?.map((child) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    ფილტრების გასუფთავება
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Products Table */}
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ნაჩვენებია {(page - 1) * limit + 1}-დან{" "}
                {Math.min(page * limit, data.total)}-მდე, სულ {data.total}{" "}
                პროდუქტი
              </div>
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ProductForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={editingProduct}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
        isCreating={createProduct.isPending}
        isUpdating={updateProduct.isPending}
      />
    </div>
  );
}
