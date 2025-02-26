import { Request, Response } from 'express';
import { ModuleService } from '../service/module.service';
import { createModuleSchema, updateModuleSchema } from '../validation/module.validation';
import { Types } from 'mongoose';
import { Module } from '../models/module.model';
import { IModule } from '../interface/module.interface';

const moduleService = new ModuleService();

export class ModuleController {
  // Create a new Module
  static async createModule(req: Request, res: Response) {
    try {
      // Validate incoming data using Zod (or another validation method)
      const validatedData = createModuleSchema.parse(req.body);

      // Convert `course` to ObjectId if it's a string
      validatedData.course = new Types.ObjectId(
        validatedData.course,
      ) as unknown as string;

      // Create the module using Mongoose Model
      const module = new Module(validatedData);

      // Save the new module
      await module.save();

      return res.status(201).json(module);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get all modules by course ID
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
  static async getAllModules(req: Request, res: Response) {
    try {
      const modules = await Module.find().populate('course', 'title'); // ✅ Populate course title
      res.status(200).json({ success: true, modules });
    } catch (error) {
      console.error('Error fetching modules:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch modules' });
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

  // Update an existing module
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

  // Delete a module by its ID
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

