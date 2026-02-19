"use client";

import { useEffect } from "react";
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
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../types";
import { createSlug } from "@/lib/slugify";

const categorySchema = yup.object({
  name: yup.object({
    ka: yup.string().required("ქართულად დასახელება სავალდებულოა"),
    en: yup.string().required("ინგლისურად დასახელება სავალდებულოა"),
  }),
  slug: yup.string().required("სლაგი სავალდებულოა"),
});

type CategoryFormValues = yup.InferType<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onCreate: (data: CreateCategoryDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateCategoryDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function CategoryForm({
  isOpen,
  onClose,
  category,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
}: CategoryFormProps) {
  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: { ka: "", en: "" },
      slug: "",
    },
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      try {
        if (category) {
          await onUpdate(category._id, values);
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
      if (category) {
        formik.setValues({
          name: category.name,
          slug: category.slug,
        });
      } else {
        formik.resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category]);

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
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {category ? "კატეგორიის რედაქტირება" : "კატეგორიის შექმნა"}
            </DialogTitle>
            <DialogDescription>
              {category
                ? "კატეგორიის ინფორმაციის განახლება."
                : "ახალი კატეგორიის დამატება. მოგვიანებით შეძლებთ ბრენდებზე მინიჭებას."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>დასახელება</Label>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="category-name-ka"
                    className="text-sm text-muted-foreground"
                  >
                    Georgian (ქართული)
                  </Label>
                  <Input
                    id="category-name-ka"
                    name="name.ka"
                    placeholder="კატეგორია"
                    value={formik?.values?.name?.ka || ""}
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
                    htmlFor="category-name-en"
                    className="text-sm text-muted-foreground"
                  >
                    ინგლისურად
                  </Label>
                  <Input
                    id="category-name-en"
                    name="name.en"
                    placeholder="მაგ.: Category"
                    value={formik.values.name.en}
                    onBlurCapture={onBlurCapture}
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
              <Label htmlFor="category-slug">სლაგი</Label>
              <Input
                id="category-slug"
                name="slug"
                placeholder="power-tools"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-xs text-muted-foreground">
                URL-ზე გამოსაყენებელი იდენტიფიკატორი (უნდა იყოს უნიკალური)
              </p>
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm font-medium text-destructive">
                  {formik.errors.slug}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              გაუქმება
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {category ? "განახლება მიმდინარეობს..." : "შექმნა მიმდინარეობს..."}
                </>
              ) : category ? (
                "განახლება"
              ) : (
                "შექმნა"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
