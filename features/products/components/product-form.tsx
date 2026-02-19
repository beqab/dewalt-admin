"use client";

import { useEffect, useMemo } from "react";
import { useFormik, FormikProvider } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { FinaProductPicker } from "./fina-product-picker";
import { useGetFinaProductsRestArray } from "@/features/fina";

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
  const finaRestArray = useGetFinaProductsRestArray();

  const markAllTouched = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(markAllTouched);
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(obj)) out[k] = markAllTouched(obj[k]);
      return out;
    }
    return true;
  };

  // Compute initial form data based on product prop
  const initialFormData = useMemo(() => {
    if (product) {
      const brandId = product.brandId._id;
      const categoryId = product.categoryId._id;
      const childCategoryId = product.childCategoryId?._id;

      return {
        name: product.name,
        code: product.code,
        finaId: product.finaId,
        finaCode: product.finaCode || "",
        description: product.description,
        image: product.image,
        images: product.images || [],
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        inStock: product.inStock,
        quantity: product.quantity,
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
      finaId: undefined,
      finaCode: "",
      description: { ka: "", en: "" },
      image: "",
      images: [] as string[],
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      inStock: true,
      quantity: 0,
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
        const finaIdRaw = (values as unknown as { finaId?: unknown }).finaId;
        const finaId =
          finaIdRaw === undefined ||
          finaIdRaw === null ||
          String(finaIdRaw).trim() === ""
            ? undefined
            : Number(finaIdRaw);

        const finaCodeRaw = String(
          (values as unknown as { finaCode?: unknown }).finaCode ?? ""
        ).trim();
        const finaCode = finaCodeRaw.length > 0 ? finaCodeRaw : undefined;

        if (product) {
          const updateData: UpdateProductDto = {
            ...values,
            images: values.images?.filter((img): img is string => Boolean(img)),
            childCategoryId: values.childCategoryId || undefined,
            finaId: Number.isFinite(finaId as number)
              ? (finaId as number)
              : undefined,
            finaCode,
          };
          await onUpdate(product._id, updateData);
        } else {
          const createData: CreateProductDto = {
            ...(values as CreateProductDto),
            finaId: Number.isFinite(finaId as number)
              ? (finaId as number)
              : undefined,
            finaCode,
          };
          await onCreate(createData);
        }
        formik.resetForm();
        onClose();
      } catch (err) {
        // mutation hooks already toast errors, but keep a fallback just in case
        const msg =
          err instanceof Error ? err.message : "პროდუქტის შენახვა ვერ მოხერხდა";
        toast.error(msg);
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

  // Auto-calculate discount (%) based on price and originalPrice
  useEffect(() => {
    const price = Number(formik.values.price);
    const originalRaw = (
      formik.values as unknown as { originalPrice?: unknown }
    ).originalPrice;
    const isOriginalEmpty =
      originalRaw === undefined ||
      originalRaw === null ||
      (typeof originalRaw === "string" && originalRaw.trim().length === 0);

    // If original price is empty, keep it in sync with price
    if (isOriginalEmpty && Number.isFinite(price)) {
      formik.setFieldValue("originalPrice", price, false);
      return;
    }

    const original = Number(originalRaw);

    let nextDiscount = 0;
    if (Number.isFinite(price) && Number.isFinite(original) && original > 0) {
      const raw = ((original - price) / original) * 100;
      if (Number.isFinite(raw) && raw > 0) {
        nextDiscount = Math.round(raw);
      }
    }

    nextDiscount = Math.min(100, Math.max(0, nextDiscount));
    const current = Number(formik.values.discount ?? 0);
    const safeCurrent = Number.isFinite(current) ? current : 0;

    if (safeCurrent !== nextDiscount) {
      formik.setFieldValue("discount", nextDiscount, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.price, formik.values.originalPrice]);

  const onBlurCapture = () => {
    formik.setFieldValue("slug", createSlug(formik.values.name.en));
  };

  const handleSubmitAttempt = async () => {
    // Auto-fill slug if user didn't leave the name field
    if (!formik.values.slug && formik.values.name?.en) {
      formik.setFieldValue("slug", createSlug(formik.values.name.en), false);
    }

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(markAllTouched(formik.values) as never, true);
      toast.error("გთხოვთ შეამოწმოთ სავალდებულო ველები");
      return;
    }

    await formik.submitForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {product ? "პროდუქტის რედაქტირება" : "პროდუქტის შექმნა"}
              </DialogTitle>
              <DialogDescription>
                {product
                  ? "პროდუქტის ინფორმაციის განახლება"
                  : "კატალოგში ახალი პროდუქტის დამატება"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="name.en"
                  label="სახელი (ინგლისურად)"
                  required
                  placeholder="პროდუქტის სახელი ინგლისურად"
                  onBlurCapture={onBlurCapture}
                />
                <FormField
                  name="name.ka"
                  label="სახელი (ქართულად)"
                  required
                  placeholder="პროდუქტის სახელი ქართულად"
                />
              </div>

              {/* Code and Slug */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="code"
                  label="პროდუქტის კოდი"
                  required
                  placeholder="DEW-86511"
                />
                <FormField
                  name="slug"
                  label="სლაგი"
                  required
                  placeholder="product-slug"
                />
              </div>

              {/* FINA Integration */}
              <div className="space-y-3 rounded-md border p-4">
                <div className="text-sm font-medium">FINA ინტეგრაცია</div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="finaId"
                    label="FINA ID"
                    placeholder="მაგ. 12345"
                    type="number"
                    min={1}
                  />
                  <FormField
                    name="finaCode"
                    label="FINA Code"
                    placeholder="მაგ. FINA-ABC-001"
                  />
                </div>
                <FinaProductPicker
                  onSelect={async (p) => {
                    formik.setFieldValue("finaId", p.id);
                    if (p.code) formik.setFieldValue("finaCode", p.code);

                    try {
                      const res = await finaRestArray.mutateAsync([p.id]);
                      const total = (res?.rest || [])
                        .filter((x) => Number(x?.id) === p.id)
                        .reduce((sum, x) => sum + (Number(x?.rest) || 0), 0);

                      if (Number.isFinite(total)) {
                        formik.setFieldValue("quantity", total);
                        formik.setFieldValue("inStock", total > 0);
                      }
                    } catch {
                      // ignore FINA rest errors; user can fill quantity manually
                    }
                  }}
                />
              </div>

              {/* Stock and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formik.values.inStock}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("inStock", checked === true)
                    }
                  />
                  <Label htmlFor="inStock">მარაგშია</Label>
                </div>
                <FormField
                  name="quantity"
                  label="რაოდენობა"
                  required
                  type="number"
                  min={0}
                  step="1"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="description.en"
                  label="აღწერა (ინგლისურად)"
                  required
                  placeholder="პროდუქტის აღწერა ინგლისურად"
                  as="textarea"
                  rows={3}
                />
                <FormField
                  name="description.ka"
                  label="აღწერა (ქართულად)"
                  required
                  placeholder="პროდუქტის აღწერა ქართულად"
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
                  label="მთავარი სურათი *"
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
                  label="დამატებითი სურათები (მაქს. 6)"
                  maxImages={6}
                />
                {formik.touched.images && formik.errors.images && (
                  <p className="text-sm text-destructive">
                    {typeof formik.errors.images === "string"
                      ? formik.errors.images
                      : "არასწორი სურათები"}
                  </p>
                )}
              </div>
              {/* Specs */}
              <ProductSpecs />

              {/* Price Fields */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  name="price"
                  label="ფასი"
                  required
                  type="number"
                  min={0}
                  step="0.01"
                />
                <FormField
                  name="originalPrice"
                  label="ძველი ფასი"
                  type="number"
                  min={0}
                  step="0.01"
                />
                <FormField
                  name="discount"
                  label="ფასდაკლება (%)"
                  type="number"
                  min={0}
                  max={100}
                  disabled
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
                  <Label htmlFor="childCategoryId">ქვე-კატეგორია</Label>
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
                    <option value="">არცერთი</option>
                    {childCategories?.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.name.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                გაუქმება
              </Button>
              <Button
                type="button"
                onClick={handleSubmitAttempt}
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {product ? "განახლება" : "შექმნა"}
              </Button>
            </DialogFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}
