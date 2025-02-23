import { Lecture } from '../models/lecture.model';
import { Module } from '../models/module.model';
import { Course } from '../models/course.model';
import AppError from '../errors/AppError';

export class LectureService {
  
  async createLecture({
    title,
    description,
    videoLink,
    course,
    moduleId,
    duration, 
    videoNum,
  }: {
    title: string;
    description: string;
    videoLink: string;
    course: string;
    moduleId: string;
    duration: number; 
    videoNum: number;
  }) {
    // Check if the course exists
    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      throw new AppError(404, 'Course not found');
    }

    // Check if the module exists
    const existingModule = await Module.findById(moduleId);
    if (!existingModule) {
      throw new AppError(404, 'Module not found');
    }

   
    const existingVideoNum = existingModule.lectures.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lecture: any) => lecture.videoNum === videoNum,
    );

    if (existingVideoNum) {
      throw new AppError(400, 'Video number must be unique within the module');
    }

    // Convert duration from seconds to minutes
    const durationInMinutes = (duration / 60).toFixed(2); // convert seconds to minutes

   
    const newLecture = new Lecture({
      title,
      description,
      videoLink,
      course,
      moduleId,
      videoNum, 
      duration: durationInMinutes, 
    });

  
    await newLecture.save();

    // Add the lecture to the module
    existingModule.lectures.push(newLecture._id);
    await existingModule.save(); /
    return newLecture;
  }


  async calculateVideoNum(moduleId: string): Promise<number> {
    const existingModule = await Module.findById(moduleId).populate('lectures');
    if (!existingModule) {
      throw new AppError(404, 'Module not found');
    }

    return existingModule.lectures.length + 1; // New videoNum will be one more than the current count of lectures
  }

  async getLecturesByModule(moduleId: string) {
    const lectures = await Lecture.find({ moduleId })
      .populate('course')
      .populate('moduleId');

    if (!lectures || lectures.length === 0) {
      throw new AppError(404, 'No lectures found for this module');
    }

    return lectures;
  }

  async getLectureById(lectureId: string) {
    const lecture = await Lecture.findById(lectureId)
      .populate('course')
      .populate('moduleId');

    if (!lecture) {
      throw new AppError(404, 'Lecture not found');
    }

    return lecture;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateLecture(lectureId: string, updates: any) {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      throw new AppError(404, 'Lecture not found');
    }

    Object.assign(lecture, updates);

    await lecture.save();

    return lecture;
  }


  async deleteLecture(lectureId: string) {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      throw new AppError(404, 'Lecture not found');
    }

    await Lecture.deleteOne({ _id: lectureId });

    return lecture;
  }
}
