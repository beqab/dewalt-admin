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
};

export default QUERY_KEYS;
