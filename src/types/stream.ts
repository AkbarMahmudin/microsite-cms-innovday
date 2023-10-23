// ----------------------------------------------------------------------

export type IStreamFilterValue = string | number;

export type IStreamFilters = {
  publish: string;
  page: number;
};

// ----------------------------------------------------------------------

export type IStreamHero = {
  title: string;
  coverUrl: string;
  createdAt?: Date;
  author?: {
    name: string;
    avatarUrl: string;
  };
};

export type IStreamComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: Date;
  users: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    postedAt: Date;
    tagUser?: string;
  }[];
};

export type IStreamItem = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  category: {
    name: string;
  };
  status: string;
  content: string;
  thumbnail: string;
  metaTitle: string;
  totalViews?: number;
  totalShares?: number;
  description: string;
  key?: string;
  totalComments?: number;
  totalFavorites?: number;
  metaKeywords: string[];
  metaDescription: string;
  createdAt: Date;
  publishedAt: Date;
  author: {
    name: string;
    avatarUrl?: string;
  };
  youtubeID: string;
  slidoID: string;
  startDate: Date;
  endDate: Date;
};

export const StreamStatusColor: any = {
  PUBLISHED: 'success',
  DRAFT: 'default',
  ARCHIVED: 'default',
  PRIVATE: 'warning',
  SCHEDULED: 'info',
};
