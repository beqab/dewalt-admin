export type LocalizedText = {
  ka: string;
  en: string;
};

export interface ServiceCenter {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  heroTitle?: LocalizedText;
  content?: LocalizedText;
  imageUrl?: string;
}

export type UpdateServiceCenterDto = Partial<
  Pick<ServiceCenter, "heroTitle" | "content" | "imageUrl">
>;
