import mongoose, { Schema } from 'mongoose';
import { IModule } from '../interface/module.interface';

const ModuleSchema = new Schema<IModule>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    moduleNumber: { type: Number, required: true },
    lectures: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }],
  },
  { timestamps: true },
);

// Ensure unique moduleNumber within a course
ModuleSchema.index({ course: 1, moduleNumber: 1 }, { unique: true });
export const Module = mongoose.model<IModule>('Module', ModuleSchema);
