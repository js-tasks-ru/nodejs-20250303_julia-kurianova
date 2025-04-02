import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const task = new Task();
    task.description = createTaskDto.description;
    task.title = createTaskDto.title;
    task.isCompleted = createTaskDto.isCompleted || false;

    await this.taskRepository.save(task);
    return task;
  }

  async findAll() {
    return this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id: id });
    if (!task) throw new NotFoundException(`task with ${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    // console.log("task upd: ", task);

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

    await this.taskRepository.save(task);
    return task;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    console.log("task", task);
    if (!task) throw new NotFoundException(`task with ${id} not found`);
    await this.taskRepository.delete(id);
  }
}
