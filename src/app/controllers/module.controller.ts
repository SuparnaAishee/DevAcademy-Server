import { Request, Response } from 'express';
import { ModuleService } from '../service/module.service';
import { createModuleSchema, updateModuleSchema } from '../validation/module.validation';
import { Types } from 'mongoose';
import { Module } from '../models/module.model';
import { IModule } from '../interface/module.interface';

const moduleService = new ModuleService();

export class ModuleController {
 
  static async createModule(req: Request, res: Response) {
    try {
      
      const validatedData = createModuleSchema.parse(req.body);

      // Convert `course` to ObjectId if it's a string
      validatedData.course = new Types.ObjectId(validatedData.course) as unknown as string;

      // Create the module using Mongoose Model
      const module = new Module(validatedData);

     
      await module.save();

      return res.status(201).json(module);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }


  static async getModulesByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const modules = await moduleService.getModulesByCourse(courseId);
      return res.status(200).json(modules);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get a specific module by its ID
  static async getModuleById(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const module = await moduleService.getModuleById(moduleId);
      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }
      return res.status(200).json(module);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const validatedData = updateModuleSchema.parse(req.body);
      const moduleData: IModule = new Module(validatedData).toObject();
      const updatedModule = await moduleService.updateModule(
        moduleId,
        moduleData,
      );
      if (!updatedModule) {
        return res.status(404).json({ error: 'Module not found' });
      }
      return res.status(200).json(updatedModule);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
      return res.status(400).json({ error: error.message });
      
    }
  }

  static async deleteModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      await moduleService.deleteModule(moduleId);
      return res.status(200).json({ message: 'Module deleted successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
