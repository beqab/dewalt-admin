// Ad Position enum matching backend
export enum AdPosition {
  MAIN_PAGE = "main_page",
  ASIDE = "aside",
  FOOTER = "footer",
}

// Ad type matching backend structure
export interface Ad {
  _id: string;
  imageUrl: string;
  urlLink?: string;
  position: AdPosition;
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating ads
export interface CreateAdDto {
  imageUrl: string;
  urlLink?: string;
  position: AdPosition;
}

export interface UpdateAdDto {
  imageUrl?: string;
  urlLink?: string;
  position?: AdPosition;
}

// Ad Response
export type AdResponse = Ad;
