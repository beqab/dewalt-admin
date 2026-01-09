"use client";

import { useEffect, useMemo } from "react";
import { useFormik, FormikProvider } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import UploadImage from "@/components/uploadImage";
import MultipleImageUpload from "@/components/uploadImage/multiple-upload";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductSpec,
} from "../types";
import {
  useGetBrands,
  useGetCategories,
  useGetChildCategories,
} from "@/features/categories";
import { BrandSelector } from "@/features/categories/components/brand-selector";
import { CategorySelector } from "@/features/categories/components/category-selector";
import { createSlug } from "@/lib/slugify";
import { FormField } from "@/components/ui/formField";
import { ProductSpecs } from "./product-specs";
import { productSchema } from "../schemas/product.schema";

type ProductFormValues = yup.InferType<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onCreate: (data: CreateProductDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateProductDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function ProductForm({
  isOpen,
  onClose,
  product,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
}: ProductFormProps) {
  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();

  // Compute initial form data based on product prop
  const initialFormData = useMemo(() => {
    if (product) {
      const brandId =
        typeof product.brandId === "string"
          ? product.brandId
          : product.brandId._id;
      const categoryId =
        typeof product.categoryId === "string"
          ? product.categoryId
          : product.categoryId._id;
      const childCategoryId = product.childCategoryId
        ? typeof product.childCategoryId === "string"
          ? product.childCategoryId
          : product.childCategoryId._id
        : undefined;

      return {
        name: product.name,
        code: product.code,
        description: product.description,
        image: product.image,
        images: product.images || [],
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        inStock: product.inStock,
        slug: product.slug,
        brandId,
        categoryId,
        childCategoryId,
        specs: product.specs || [],
      };
    }
    return {
      name: { ka: "", en: "" },
      code: "",
      description: { ka: "", en: "" },
      image: "",
      images: [] as string[],
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      inStock: true,
      slug: "",
      brandId: "",
      categoryId: "",
      childCategoryId: undefined,
      specs: [] as ProductSpec[],
    };
  }, [product]);

  const formik = useFormik<ProductFormValues>({
    initialValues: initialFormData,
    validationSchema: productSchema,
    onSubmit: async (values) => {
      try {
        if (product) {
          const updateData: UpdateProductDto = {
            ...values,
            images: values.images?.filter((img): img is string => Boolean(img)),
            childCategoryId: values.childCategoryId || undefined,
            specs: values.specs?.map((spec) => ({
              label: spec.label,
              value:
                typeof spec.value === "string" || typeof spec.value === "number"
                  ? spec.value
                  : String(spec.value),
              unit: spec.unit,
            })),
          };
          await onUpdate(product._id, updateData);
        } else {
          await onCreate(values as CreateProductDto);
        }
        formik.resetForm();
        onClose();
      } catch {
        // Error handling is done in the mutation
      }
    },
    enableReinitialize: true,
  });

  const { data: childCategories } = useGetChildCategories(
    formik.values.brandId || undefined,
    formik.values.categoryId || undefined
  );

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      formik.setValues(initialFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialFormData]);

  const onBlurCapture = () => {
    formik.setFieldValue("slug", createSlug(formik.values.name.en));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {product ? "Edit Product" : "Create Product"}
              </DialogTitle>
              <DialogDescription>
                {product
                  ? "Update product information"
                  : "Add a new product to the catalog"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="name.en"
                  label="Name (English)"
                  required
                  placeholder="Product name in English"
                  onBlurCapture={onBlurCapture}
                />
                <FormField
                  name="name.ka"
                  label="Name (Georgian)"
                  required
                  placeholder="Product name in Georgian"
                />
              </div>

              {/* Code and Slug */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="code"
                  label="Product Code"
                  required
                  placeholder="DEW-86511"
                />
                <FormField
                  name="slug"
                  label="Slug"
                  required
                  placeholder="product-slug"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="description.en"
                  label="Description (English)"
                  required
                  placeholder="Product description in English"
                  as="textarea"
                  rows={3}
                />
                <FormField
                  name="description.ka"
                  label="Description (Georgian)"
                  required
                  placeholder="Product description in Georgian"
                  as="textarea"
                  rows={3}
                />
              </div>

              {/* Image */}
              <div className="space-y-2">
                <UploadImage
                  onImageChange={(url) => formik.setFieldValue("image", url)}
                  imageUrl={formik.values.image}
                  defaultImageUrl={product?.image}
                  label="Main Image *"
                />
                {formik.touched.image && formik.errors.image && (
                  <p className="text-sm text-destructive">
                    {formik.errors.image}
                  </p>
                )}
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <MultipleImageUpload
                  onImagesChange={(urls) =>
                    formik.setFieldValue("images", urls.filter(Boolean))
                  }
                  images={(formik.values.images || []).filter(
                    (img): img is string => Boolean(img)
                  )}
                  defaultImages={product?.images}
                  label="Additional Images (Max 6)"
                  maxImages={6}
                />
                {formik.touched.images && formik.errors.images && (
                  <p className="text-sm text-destructive">
                    {typeof formik.errors.images === "string"
                      ? formik.errors.images
                      : "Invalid images"}
                  </p>
                )}
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  name="price"
                  label="Price"
                  required
                  type="number"
                  min={0}
                  step="0.01"
                />
                <FormField
                  name="originalPrice"
                  label="Original Price"
                  type="number"
                  min={0}
                  step="0.01"
                />
                <FormField
                  name="discount"
                  label="Discount (%)"
                  type="number"
                  min={0}
                  max={100}
                />
              </div>

              {/* Brand, Category, Child Category */}
              <div className="grid grid-cols-3 gap-4">
                <BrandSelector
                  brands={brands}
                  value={formik.values.brandId}
                  onValueChange={(value) => {
                    formik.setFieldValue("brandId", value);
                  }}
                />
                <CategorySelector
                  categories={categories}
                  value={formik.values.categoryId}
                  onValueChange={(value) => {
                    formik.setFieldValue("categoryId", value || "");
                    formik.setFieldValue("childCategoryId", undefined);
                  }}
                  filterByBrandIds={
                    formik.values.brandId ? [formik.values.brandId] : undefined
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="childCategoryId">Child Category</Label>
                  <select
                    id="childCategoryId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formik.values.childCategoryId || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "childCategoryId",
                        e.target.value || undefined
                      )
                    }
                    disabled={!formik.values.categoryId}
                  >
                    <option value="">None</option>
                    {childCategories?.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.name.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={formik.values.inStock}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("inStock", checked === true)
                  }
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>

              {/* Specs */}
              <ProductSpecs />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {product ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}
