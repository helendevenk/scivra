export interface GalleryListParams {
  cursor?: string;
  limit?: number; // default 20, max 50
  sort?: 'latest' | 'popular' | 'most_liked';
  tag?: string;
  q?: string;
  author?: string;
  verified?: boolean;
}

export interface GalleryListItem {
  id: string;
  userId: string | null;
  prompt: string;
  language: string;
  category: string | null;
  htmlSize: number | null;
  isPublic: boolean | null;
  viewCount: number | null;
  likeCount: number | null;
  forkCount: number | null;
  featured: boolean | null;
  tags: string[] | null;
  forkedFrom: string | null;
  validationScore: number | null;
  validatedAt: Date | null;
  createdAt: Date;
  // Joined fields
  authorName?: string;
  authorImage?: string | null;
  isLiked?: boolean;
}

export interface GalleryListResponse {
  list: GalleryListItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GalleryDetailItem extends GalleryListItem {
  htmlContent: string | null;
  htmlUrl: string | null;
  shareCount: number | null;
  downloadCount: number | null;
  validationDetails: string | null;
}
