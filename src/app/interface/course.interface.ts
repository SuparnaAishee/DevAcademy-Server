export interface ICourse {
  title: string;
  price: number;
  discountPrice?: number;
  description: string;
  thumbnail: string;
  batch?: string;
  regStart?: Date;
  regEnd?: Date;
  duration: string;
  totalSeats: number;
  totalLesson: number;
  keySkills: string[];
  totalAssignment?: number;
  courseCurriculum?: string[];
  category: string;
}

export interface CourseQueryOptions {
  title?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
