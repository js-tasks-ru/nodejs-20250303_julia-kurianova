import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskModel.create(createTaskDto);
  }

  async findAll() {
    return await this.taskModel.find();
  }

  async findOne(id: ObjectId) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException(`task with ${id} not found`);

    return task;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException(`task with ${id} not found`);

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      task.title = updateTaskDto.title;
    }

    if (
      updateTaskDto.description &&
      updateTaskDto.description !== task.description
    ) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.isCompleted !== task.isCompleted) {
      task.isCompleted = updateTaskDto.isCompleted;
    }

    await this.taskModel.updateOne(task);
    return task;
  }

  async remove(id: ObjectId) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException(`task with ${id} not found`);

    await this.taskModel.deleteOne(id);
  }
}
