import { Request, Response } from 'express';
import { CourseService } from '../service/course.service';

const courseService = new CourseService();

export const createCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

export const getCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const queryOptions = req.query;
    const courses = await courseService.getCourses(queryOptions);
    res.status(200).json(courses);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json(course);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json(course);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};
