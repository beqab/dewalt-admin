"use client";

import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ChildCategory,
  CreateChildCategoryDto,
  UpdateChildCategoryDto,
} from "../types";
import { useGetBrands, useGetCategories } from "@/features/categories";
import { BrandMultiSelector } from "./brand-multi-selector";
import { CategorySelector } from "./category-selector";
import { createSlug } from "@/lib/slugify";

const childCategorySchema = yup.object({
  name: yup.object({
    ka: yup.string().required("Georgian name is required"),
    en: yup.string().required("English name is required"),
  }),
  slug: yup.string().required("Slug is required"),
  brandIds: yup.array().of(yup.string()).default([]),
  categoryId: yup.string().optional(),
});

type ChildCategoryFormValues = {
  name: {
    ka: string;
    en: string;
  };
  slug: string;
  brandIds: string[];
  categoryId?: string;
};

interface ChildCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  childCategory?: ChildCategory;
  onCreate: (data: CreateChildCategoryDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateChildCategoryDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function ChildCategoryForm({
  isOpen,
  onClose,
  childCategory,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
}: ChildCategoryFormProps) {
  const { data: brands } = useGetBrands();
  const { data: categories } = useGetCategories();

  // Compute initial form data based on childCategory prop
  const initialFormData = useMemo(() => {
    if (childCategory) {
      const brandIds = Array.isArray(childCategory.brandIds)
        ? childCategory.brandIds.map((b) => b._id)
        : [];
      const categoryId =
        typeof childCategory.categoryId === "string"
          ? childCategory.categoryId
          : childCategory.categoryId?._id || undefined;
      return {
        name: childCategory.name,
        slug: childCategory.slug,
        brandIds,
        categoryId,
      };
    }
    return {
      name: { ka: "", en: "" },
      slug: "",
      brandIds: [] as string[],
      categoryId: undefined as string | undefined,
    };
  }, [childCategory]);

  const formik = useFormik<ChildCategoryFormValues>({
    initialValues: initialFormData,
    validationSchema: childCategorySchema,
    onSubmit: async (values) => {
      try {
        if (childCategory) {
          const updateData: UpdateChildCategoryDto = {
            name: values.name,
            slug: values.slug,
            brandIds: values.brandIds || [],
            categoryId: values.categoryId || undefined,
          };
          await onUpdate(childCategory._id, updateData);
        } else {
          await onCreate(values);
        }
        formik.resetForm();
        onClose();
      } catch {
        // Error handling is done in the mutation
      }
    },
    enableReinitialize: true,
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      formik.setValues(initialFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialFormData]);

  const availableCategories = useMemo(() => {
    const brandIds = formik.values.brandIds || [];
    return categories?.filter((category) => {
      if (brandIds.length > 0) {
        const categoryBrandIds = Array.isArray(category.brandIds)
          ? category.brandIds.map((b) => b._id)
          : [];
        return brandIds.some((brandId) => categoryBrandIds.includes(brandId));
      }
      return true;
    });
  }, [categories, formik.values.brandIds]);

  const onBlurCapture = () => {
    if (formik.values.name.en) {
      formik.setValues({
        ...formik.values,
        slug: createSlug(formik.values.name.en || ""),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {childCategory ? "Edit Child Category" : "Create Child Category"}
            </DialogTitle>
            <DialogDescription>
              {childCategory
                ? "Update child category information."
                : "Add a new child category. You can assign it to brands and categories later."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="child-category-name-ka"
                    className="text-sm text-muted-foreground"
                  >
                    Georgian (ქართული)
                  </Label>
                  <Input
                    id="child-category-name-ka"
                    name="name.ka"
                    placeholder="შვილი კატეგორია"
                    value={formik.values.name.ka}
                    onChange={(e) => {
                      formik.setFieldValue("name.ka", e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name?.ka && formik.errors.name?.ka && (
                    <p className="text-sm font-medium text-destructive">
                      {formik.errors.name.ka}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="child-category-name-en"
                    className="text-sm text-muted-foreground"
                  >
                    English
                  </Label>
                  <Input
                    id="child-category-name-en"
                    name="name.en"
                    placeholder="Child Category"
                    value={formik.values.name.en}
                    onChange={(e) => {
                      formik.setFieldValue("name.en", e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name?.en && formik.errors.name?.en && (
                    <p className="text-sm font-medium text-destructive">
                      {formik.errors.name.en}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="child-category-slug">Slug</Label>
              <Input
                id="child-category-slug"
                name="slug"
                placeholder="drills"
                defaultValue={createSlug(formik.values.name.en)}
                onBlurCapture={onBlurCapture}
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (must be unique)
              </p>
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm font-medium text-destructive">
                  {formik.errors.slug}
                </p>
              )}
            </div>

            {/* Brands Selection */}
            {childCategory ? (
              <div className="space-y-2">
                <BrandMultiSelector
                  brands={brands}
                  selectedBrandIds={formik.values.brandIds || []}
                  onSelectionChange={(brandIds) => {
                    formik.setFieldValue("brandIds", brandIds);
                  }}
                  showCurrentBrands={true}
                  onRemoveBrand={(brandId) => {
                    formik.setFieldValue(
                      "brandIds",
                      (formik.values.brandIds || []).filter(
                        (id) => id !== brandId
                      )
                    );
                  }}
                />
                {formik.touched.brandIds && formik.errors.brandIds && (
                  <p className="text-sm font-medium text-destructive">
                    {typeof formik.errors.brandIds === "string"
                      ? formik.errors.brandIds
                      : "Invalid brand selection"}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <BrandMultiSelector
                  brands={brands}
                  selectedBrandIds={formik.values.brandIds || []}
                  onSelectionChange={(brandIds) => {
                    formik.setFieldValue("brandIds", brandIds);
                  }}
                />
                {formik.touched.brandIds && formik.errors.brandIds && (
                  <p className="text-sm font-medium text-destructive">
                    {typeof formik.errors.brandIds === "string"
                      ? formik.errors.brandIds
                      : "Invalid brand selection"}
                  </p>
                )}
              </div>
            )}

            {/* Category Selection */}
            {childCategory ? (
              <>
                {formik.values.categoryId && (
                  <div className="space-y-2">
                    <Label>Current Category</Label>
                    <div className="flex items-center justify-between p-2 border rounded bg-muted/50">
                      <span className="text-sm font-medium">
                        {categories?.find(
                          (c) => c._id === formik.values.categoryId
                        )?.name.en || "Unknown"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          formik.setFieldValue("categoryId", undefined);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <CategorySelector
                    categories={availableCategories}
                    value={formik.values.categoryId}
                    onValueChange={(value) => {
                      formik.setFieldValue("categoryId", value);
                    }}
                    label={
                      formik.values.categoryId
                        ? "Change Category"
                        : "Add Category"
                    }
                    filterByBrandIds={formik.values.brandIds || []}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formik.values.brandIds || []).length > 0
                      ? "Only categories for selected brands are shown."
                      : "Select a parent category."}
                  </p>
                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <p className="text-sm font-medium text-destructive">
                      {formik.errors.categoryId}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <CategorySelector
                  categories={availableCategories}
                  value={formik.values.categoryId}
                  onValueChange={(value) => {
                    formik.setFieldValue("categoryId", value);
                  }}
                  filterByBrandIds={formik.values.brandIds || []}
                />
                <p className="text-xs text-muted-foreground">
                  {(formik.values.brandIds || []).length > 0
                    ? "Only categories for selected brands are shown."
                    : "Select a parent category (optional)."}
                </p>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <p className="text-sm font-medium text-destructive">
                    {formik.errors.categoryId}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {childCategory ? "Updating..." : "Creating..."}
                </>
              ) : childCategory ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
