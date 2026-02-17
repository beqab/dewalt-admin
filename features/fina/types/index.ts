export type FinaProductListItem = {
  id: number;
  code?: string;
  name?: string;
};

export type FinaProductsRestItem = {
  id: number;
  store: number;
  rest: number;
  reserve: number;
};

export type FinaProductsRestArrayResponse = {
  rest: FinaProductsRestItem[];
  ex: unknown;
};

