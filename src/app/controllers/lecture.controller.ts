import { Request, Response, NextFunction } from 'express';
import { LectureService } from '../service/lecture.service';
import { createLectureSchema, updateLectureSchema } from '../validation/lecture.validation';
import AppError from '../errors/AppError';
import { ZodError } from 'zod';
import { Lecture } from '../models/lecture.model';

const lectureService = new LectureService();

export class LectureController {
  // Create a new lecture
  async createLecture(req: Request, res: Response, next: NextFunction) {
    try {
      // Zod validation for the request body
      const validatedData = createLectureSchema.parse(req.body);

      const {
        title,
        description,
        videoLink,
        course,
        moduleId,
        duration, // Duration in HH:mm:ss format
      } = validatedData;

      // Calculate the videoNum dynamically based on the existing lectures in the module
      const videoNum = await lectureService.calculateVideoNum(moduleId);

      const lecture = await lectureService.createLecture({
        title,
        description,
        videoLink,
        course,
        moduleId,
        videoNum, // Pass videoNum to the service
        duration, // Duration in HH:mm:ss format
      });

      res.status(201).json({
        status: 'success',
        data: { lecture },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Handle validation error
        return next(
          new AppError(400, 'Validation Error', JSON.stringify(error.errors)),
        );
      }

      // Handle other errors
      next(new AppError(500, 'Server Error', error.stack));
    }
  }
  async getLectures(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;

      const lectures = await Lecture.find({ moduleId })
        .populate({
          path: 'moduleId',
          select: 'name courseId',
          populate: {
            path: 'courseId',
            model: 'Course',
            select: 'title',
          },
        })
        .exec();

      res.status(200).json({
        status: 'success',
        data: { lectures },
      });
    } catch (error) {
      next(new AppError(500, 'Server Error', (error as Error).stack));
    }
  }

  // Get a single lecture by ID
  async getLectureById(req: Request, res: Response, next: NextFunction) {
    try {
      const { lectureId } = req.params;
      const lecture = await lectureService.getLectureById(lectureId);
      if (!lecture) {
        return next(new AppError(404, 'Lecture not found'));
      }
      res.status(200).json({
        status: 'success',
        data: { lecture },
      });
    } catch (error) {
      next(new AppError(500, 'Server Error', (error as Error).stack));
    }
  }

  static async getAllLectures(req: Request, res: Response, next: NextFunction) {
    try {
      const lectures = await lectureService.getAllLectures();
      res.status(200).json(lectures);
    } catch (error) {
      next(error);
    }
  }
  // Update a lecture
  async updateLecture(req: Request, res: Response, next: NextFunction) {
    try {
      // Zod validation for the request body
      const validatedData = updateLectureSchema.parse(req.body);

      const { lectureId } = req.params;
      const updatedLecture = await lectureService.updateLecture(
        lectureId,
        validatedData,
      );
      res.status(200).json({
        status: 'success',
        data: { updatedLecture },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation error
        return next(
          new AppError(400, 'Validation Error', JSON.stringify(error.errors)),
        );
      }
      next(new AppError(500, 'Server Error', (error as Error).stack));
    }
  }

  // Delete a lecture
  async deleteLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const { lectureId } = req.params;
      await lectureService.deleteLecture(lectureId);
      res.status(204).json({
        status: 'success',
        message: 'Lecture deleted successfully',
      });
    } catch (error) {
      next(new AppError(500, 'Server Error', (error as Error).stack));
    }
  }
}
