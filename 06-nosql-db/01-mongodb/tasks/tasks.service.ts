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
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });
    if (!task) throw new NotFoundException(`task with ${id} not found`);
    return task;
  }

  async remove(id: ObjectId) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException(`task with ${id} not found`);

    await this.taskModel.deleteOne({ _id: id });
  }
}
