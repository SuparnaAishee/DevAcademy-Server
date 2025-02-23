import { Schema, model, Types } from 'mongoose';


const lectureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String, 
      required: true,
    },
    course: {
      type: Types.ObjectId,
      ref: 'Course', 
      required: true,
    },
    videoNum: {
      type: Number, 
      required: true,
    },
    duration: {
      type: Number, 
    },
    moduleId: {
      type: Types.ObjectId,
      ref: 'Module', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true, 
    },
  },
);

// Create a virtual field to get the full video URL (if needed)
lectureSchema.virtual('videoUrl').get(function () {
  // If using Cloudinary or another service,return the complete video URL
  return this.videoLink;
});

export const Lecture = model('Lecture', lectureSchema);
