const QUERY_KEYS = {
  BANNER_SLIDER: {
    ALL: ["bannerSlider"],
  },
  NEWS: {
    All: ["news"],
    list: (page?: number, limit?: number) =>
      page !== undefined && limit !== undefined
        ? ["news", page, limit]
        : ["news"],
    BY_ID: (id: string) => ["news", id],
  },
  ADS: {
    ALL: ["ads"],
    BY_ID: (id: string) => ["ads", id],
    BY_POSITION: (position: string) => ["ads", "position", position],
  },
  CATEGORIES: {
    BRANDS: {
      ALL: ["categories", "brands"],
      BY_ID: (id: string) => ["categories", "brands", id],
    },
    CATEGORIES: {
      ALL: ["categories", "categories"],
      BY_ID: (id: string) => ["categories", "categories", id],
      BY_BRAND: (brandId: string) => [
        "categories",
        "categories",
        "brand",
        brandId,
      ],
    },
    CHILD_CATEGORIES: {
      ALL: ["categories", "child-categories"],
      BY_ID: (id: string) => ["categories", "child-categories", id],
      BY_CATEGORY: (categoryId: string) => [
        "categories",
        "child-categories",
        "category",
        categoryId,
      ],
    },
  },
  PRODUCTS: {
    ALL: ["products"],
    BY_ID: (id: string) => ["products", id],
    BY_SLUG: (slug: string) => ["products", "slug", slug],
    LIST: (page?: number, limit?: number) =>
      page !== undefined && limit !== undefined
        ? ["products", "list", page, limit]
        : ["products", "list"],
  },
};

export default QUERY_KEYS;
