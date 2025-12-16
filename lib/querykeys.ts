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
};

export default QUERY_KEYS;
