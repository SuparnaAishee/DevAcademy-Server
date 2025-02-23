import { Document, Types } from 'mongoose';

export interface ILecture extends Document {
  title: string;
  description: string;
  videoLink: string;
  course: Types.ObjectId; // Reference to the Course collection
  moduleId: Types.ObjectId; // Reference to the Module collection
  videoNum: number; 
  duration: number; 
  createdAt: Date;
}
