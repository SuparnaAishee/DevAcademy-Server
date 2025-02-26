import { Course } from '../models/course.model';
import { Lecture } from '../models/lecture.model';
import { IModule } from '../interface/module.interface';
import { Module } from '../models/module.model';
import { Types } from 'mongoose';

export class ModuleService {
  // Create a new Module
  async createModule(moduleData: IModule) {
    try {
      // Check if the course exists before creating the module
      if (!moduleData.course || !Types.ObjectId.isValid(moduleData.course)) {
        throw new Error('Invalid or missing course ID');
      }

      // Optionally, check if the module already exists for the given course and moduleNumber
      const existingModule = await Module.findOne({
        course: moduleData.course,
        moduleNumber: moduleData.moduleNumber,
      });

      if (existingModule) {
        throw new Error(
          'Module already exists for this course and module number',
        );
      }

      const module = new Module(moduleData);
      await module.save();

      return module;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error creating module: ${error.message}`);
    }
  }

  // Get all modules for a specific course
  async getModulesByCourse(courseId: string | Types.ObjectId) {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid course ID');
      }

      const modules = await Module.find({ course: courseId });
      if (modules.length === 0) {
        throw new Error('No modules found for this course');
      }

      return modules;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error fetching modules: ${error.message}`);
    }
  }
  async getAllModules() {
    try {
      const modules = await Module.find();
      return modules;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error fetching modules: ${error.message}`);
    }
  }
  // Get a module by its ID
  async getModuleById(moduleId: string | Types.ObjectId) {
    try {
      if (!Types.ObjectId.isValid(moduleId)) {
        throw new Error('Invalid module ID');
      }

      const module = await Module.findById(moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      return module;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error fetching module: ${error.message}`);
    }
  }
  async updateModule(moduleId: string | Types.ObjectId, moduleData: IModule) {
    try {
      // Check if the provided module ID is valid
      if (!Types.ObjectId.isValid(moduleId)) {
        throw new Error('Invalid module ID');
      }

      // Find the existing module
      const existingModule = await Module.findById(moduleId);
      if (!existingModule) {
        throw new Error('Module not found');
      }

      // Ensure that the provided course ID exists in the database
      if (moduleData.course) {
        const courseExists = await Course.findById(moduleData.course);
        if (!courseExists) {
          throw new Error('Provided course ID does not exist');
        }
      }

      // Ensure that all lecture IDs exist in the database
      if (moduleData.lectures && moduleData.lectures.length > 0) {
        const lecturesExist = await Lecture.find({
          _id: { $in: moduleData.lectures },
        });

        // If the number of existing lectures does not match the number of provided lectures,
        // throw an error indicating that some lecture IDs don't exist
        if (lecturesExist.length !== moduleData.lectures.length) {
          throw new Error('One or more provided lecture IDs do not exist');
        }
      }

      // Remove the _id field from moduleData to avoid updating the immutable _id field
      const { _id, ...updateData } = moduleData;

      // Proceed to update the module with the filtered data (without _id)
      const updatedModule = await Module.findByIdAndUpdate(
        moduleId,
        updateData, // the fields you want to update (without _id)
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validators are run on update
        },
      );

      return updatedModule;
    } catch (error: any) {
      throw new Error(`Error updating module: ${error.message}`);
    }
  }

  // Delete a module
  async deleteModule(moduleId: string | Types.ObjectId) {
    try {
      if (!Types.ObjectId.isValid(moduleId)) {
        throw new Error('Invalid module ID');
      }

      const module = await Module.findById(moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      await Module.findByIdAndDelete(moduleId);
      return { message: 'Module deleted successfully' };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error deleting module: ${error.message}`);
    }
  }
}

