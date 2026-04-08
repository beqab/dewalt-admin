export interface Terms {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: { ka: string; en: string };
}

export type UpdateTermsDto = Partial<Terms>;
