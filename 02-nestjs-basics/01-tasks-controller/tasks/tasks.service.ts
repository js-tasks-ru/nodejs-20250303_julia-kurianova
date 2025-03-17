import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskDto } from "./dto/task.dto";

@Injectable()
export class TasksService {
  private tasks: TaskDto[] = [];

  getAllTasks(): TaskDto[] {
    return this.tasks;
  }

  getTaskById(id: string): TaskDto {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return task;
  }

  createTask(task: TaskDto): TaskDto {
    const newTAsk = { id: String(this.tasks.length + 1), ...task };
    this.tasks.push(newTAsk);
    return newTAsk;
  }

  updateTask(id: string, update: TaskDto): TaskDto {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    const updatedTask = { ...task, ...update };
    this.tasks = [
      ...this.tasks.map((task) => (task.id === id ? updatedTask : task)),
    ];
    return updatedTask;
  }

  deleteTask(id: string): TaskDto {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    this.tasks = [...this.tasks.filter((task) => task.id !== id)];
    return task;
  }
}
