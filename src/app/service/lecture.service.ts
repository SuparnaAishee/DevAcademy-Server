import { Lecture } from '../models/lecture.model';
import { Module } from '../models/module.model';
import { Course } from '../models/course.model';
import AppError from '../errors/AppError';

export class LectureService {
  // Create a new lecture with video number and duration
  async createLecture({
    title,
    description,
    videoLink,
    course,
    moduleId,
    duration, // duration in seconds
    videoNum,
  }: {
    title: string;
    description: string;
    videoLink: string;
    course: string;
    moduleId: string;
    duration: number; // Duration in seconds
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

    // Ensure unique videoNum for each module
    const existingVideoNum = existingModule.lectures.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lecture: any) => lecture.videoNum === videoNum,
    );

    if (existingVideoNum) {
      throw new AppError(400, 'Video number must be unique within the module');
    }

    // Convert duration from seconds to minutes
    const durationInMinutes = (duration / 60).toFixed(2); // convert seconds to minutes

    // Create the new lecture
    const newLecture = new Lecture({
      title,
      description,
      videoLink,
      course,
      moduleId,
      videoNum, // Add the video number
      duration: durationInMinutes, // Store duration as minutes
    });

    // Save the lecture to the database
    await newLecture.save();

    // Add the lecture to the module
    existingModule.lectures.push(newLecture._id);
    await existingModule.save(); // Saving the module after adding the lecture

    return newLecture;
  }

  // Calculate video number based on the existing lectures in the module
  async calculateVideoNum(moduleId: string): Promise<number> {
    const existingModule = await Module.findById(moduleId).populate('lectures');
    if (!existingModule) {
      throw new AppError(404, 'Module not found');
    }

    return existingModule.lectures.length + 1; // New videoNum will be one more than the current count of lectures
  }

  // Get all lectures for a specific module
  async getLecturesByModule(moduleId: string) {
    const lectures = await Lecture.find({ moduleId })
      .populate('course')
      .populate('moduleId');

    if (!lectures || lectures.length === 0) {
      throw new AppError(404, 'No lectures found for this module');
    }

    return lectures;
  }

  // Get a specific lecture by its ID
  async getLectureById(lectureId: string) {
    const lecture = await Lecture.findById(lectureId)
      .populate('course')
      .populate('moduleId');

    if (!lecture) {
      throw new AppError(404, 'Lecture not found');
    }

    return lecture;
  }

  // Update a specific lecture
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

  async getAllLectures() {
    const lectures = await Lecture.find()
      .populate('moduleId')
      .populate('course');

    if (!lectures || lectures.length === 0) {
      throw new Error('No lectures found');
    }

    return lectures;
  }


  // Delete a specific lecture
  async deleteLecture(lectureId: string) {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      throw new AppError(404, 'Lecture not found');
    }

    await Lecture.deleteOne({ _id: lectureId });

    return lecture;
  }
}

