import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.object({
    ka: yup.string().required("Georgian name is required"),
    en: yup.string().required("English name is required"),
  }),
  code: yup.string().required("Product code is required"),
  description: yup.object({
    ka: yup.string().required("Georgian description is required"),
    en: yup.string().required("English description is required"),
  }),
  image: yup.string().required("Image URL is required"),
  images: yup
    .array()
    .of(yup.string())
    .max(6, "Maximum 6 additional images allowed")
    .optional(),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  originalPrice: yup
    .number()
    .optional()
    .min(0, "Original price must be positive"),
  discount: yup
    .number()
    .optional()
    .min(0)
    .max(100, "Discount must be between 0 and 100"),
  inStock: yup.boolean().default(true),
  slug: yup.string().required("Slug is required"),
  brandId: yup.string().required("Brand is required"),
  categoryId: yup.string().required("Category is required"),
  childCategoryId: yup.string().optional(),
  specs: yup
    .array()
    .of(
      yup.object({
        label: yup.object({
          ka: yup.string().required(),
          en: yup.string().required(),
        }),
        value: yup.mixed().required(),
        unit: yup.string().optional(),
      })
    )
    .optional(),
});
