import { Document, Types } from 'mongoose';

export interface IModule extends Document {
  course: Types.ObjectId; // Reference to Course
  title: string;
  description: string;
  moduleNumber: number;
  lectures: Types.ObjectId[]; // Reference to Lecture collection
}
