import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getFilteredTasks(status?: TaskStatus, page?: number, limit?: number): Task[] {
    let filteredTasks = this.tasks;
    if (status) {
      const isValidStatus = Object.values(TaskStatus).includes(
        status as TaskStatus,
      );

      if (!isValidStatus && status !== undefined) {
        throw new BadRequestException(`Status ${status} does not exist.`);
      }
      filteredTasks = this.tasks.filter((task) => task.status === status);

      if (!filteredTasks.length) {
        throw new NotFoundException(`Task with status:${status} not found`);
      }
    }

    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(
        `Page ${page} or limit ${limit} parameter is not valid.`,
      );
    }

    if (page && limit) {
      filteredTasks = filteredTasks.slice((page - 1) * limit, page * limit);
    }
    return filteredTasks;
  }
}
