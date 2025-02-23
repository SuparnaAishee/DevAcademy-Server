import { ICourse } from '../models/course.model'; // Import the ICourse interface
import { Course } from '../models/course.model'; // Import the Course model

import {
  createCourseValidation,
  updateCourseValidation,
} from '../validation/course.validation'; // Validation schemas

// Course Service Class with methods to handle courses
export class CourseService {
  // Create a new course
  async createCourse(courseData: ICourse): Promise<ICourse> {
    // Validate the input data using zod validation schema
    const parsed = createCourseValidation.safeParse(courseData);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(', '));
    }

    // Check if a course with the same title already exists
    const existingCourse = await Course.findOne({ title: courseData.title });
    if (existingCourse) {
      throw new Error('A course with this title already exists.');
    }

    // Validate the registration dates
    if (
      courseData.regStart &&
      courseData.regEnd &&
      new Date(courseData.regStart) >= new Date(courseData.regEnd)
    ) {
      throw new Error('Registration start date must be before the end date.');
    }

    // Validate the discount price is less than the original price
    if (
      courseData.discountPrice &&
      courseData.discountPrice >= courseData.price
    ) {
      throw new Error('Discount price must be lower than the original price.');
    }

    // Create and return the new course
    return await Course.create(courseData);
  }

  // Get all courses with pagination and filtering options
  async getCourses(queryOptions: {
    title?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      title,
      category,
      priceMin,
      priceMax,
      sort = 'regStart',
      order = 'asc',
      page = 1,
      limit = 10,
    } = queryOptions;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = category;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = priceMin;
      if (priceMax) filter.price.$lte = priceMax;
    }

    const sortOption = sort || 'regStart';
    const sortOrder = order === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .sort({ [sortOption]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    return {
      data: courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  // Get a course by its ID
  async getCourseById(id: string): Promise<ICourse> {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  // Update an existing course
  async updateCourse(id: string, courseData: ICourse): Promise<ICourse> {
    const parsed = updateCourseValidation.safeParse(courseData);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(', '));
    }

    // Check if the registration dates are valid
    if (
      courseData.regStart &&
      courseData.regEnd &&
      new Date(courseData.regStart) >= new Date(courseData.regEnd)
    ) {
      throw new Error('Registration start date must be before the end date.');
    }

    // Validate the discount price if provided
    if (
      courseData.discountPrice &&
      courseData.price &&
      courseData.discountPrice >= courseData.price
    ) {
      throw new Error('Discount price must be lower than the original price.');
    }

    // Update and return the course
    const course = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    // Delete the course from the database
    await Course.findByIdAndDelete(id);
  }
}
