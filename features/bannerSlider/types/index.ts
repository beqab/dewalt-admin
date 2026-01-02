// Localized text type matching backend structure
export interface LocalizedText {
  ka: string;
  en: string;
}

// Banner type matching backend structure
export interface Banner {
  imageUrl: string;
  title: LocalizedText;
  description: LocalizedText;
  order: number;
  buttonLink?: string;
}

// Banner Slider Response matching backend DTO
export interface BannerSliderResponse {
  _id: string;
  banners: Banner[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating banners
export interface CreateBannerDto {
  imageUrl: string;
  title: LocalizedText;
  description: LocalizedText;
  buttonLink?: string;
}

export interface UpdateBannerDto {
  imageUrl?: string;
  title?: LocalizedText;
  description?: LocalizedText;
  buttonLink?: string;
}

// DTO for reordering banners (array of banners)
export interface ReorderBannersDto {
  banners: CreateBannerDto[];
}
