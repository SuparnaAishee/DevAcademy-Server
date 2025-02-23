import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
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

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    batch: { type: String },
    regStart: { type: Date },
    regEnd: { type: Date},
    duration: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    totalLesson: { type: Number, required: true },
    keySkills: [{ type: String }],
    totalAssignment: { type: Number },
    courseCurriculum: [{ type: String }],
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);