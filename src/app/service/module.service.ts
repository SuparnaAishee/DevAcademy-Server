import { Course } from '../models/course.model';
import { Lecture } from '../models/lecture.model';
import { IModule } from '../interface/module.interface';
import { Module } from '../models/module.model';
import { Types } from 'mongoose';

export class ModuleService {

  async createModule(moduleData: IModule) {
    try {
      // Check if the course exists before creating the module
      if (!moduleData.course || !Types.ObjectId.isValid(moduleData.course)) {
        throw new Error('Invalid or missing course ID');
      }

      //  check if the module already exists for the given course and moduleNumber
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

   
      const existingModule = await Module.findById(moduleId);
      if (!existingModule) {
        throw new Error('Module not found');
      }

     
      if (moduleData.course) {
        const courseExists = await Course.findById(moduleData.course);
        if (!courseExists) {
          throw new Error('Provided course ID does not exist');
        }
      }

     
      if (moduleData.lectures && moduleData.lectures.length > 0) {
        const lecturesExist = await Lecture.find({
          _id: { $in: moduleData.lectures },
        });

        // If the number of existing lectures does not match the number of provided lectures,
       
        if (lecturesExist.length !== moduleData.lectures.length) {
          throw new Error('One or more provided lecture IDs do not exist');
        }
      }

      // Remove the _id field from moduleData to avoid updating the immutable _id field
      const { _id, ...updateData } = moduleData;

      // Proceed to update the module with the filtered data (without _id)
      const updatedModule = await Module.findByIdAndUpdate(
        moduleId,
        updateData, 
        {
          new: true, 
          runValidators: true, 
        },
      );

      return updatedModule;
    } catch (error: any) {
      throw new Error(`Error updating module: ${error.message}`);
    }
  }

 
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
