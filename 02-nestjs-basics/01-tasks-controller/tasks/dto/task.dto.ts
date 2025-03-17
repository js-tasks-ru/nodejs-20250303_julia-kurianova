import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export class TaskDto {
  @IsOptional() // Optional for updates
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus, {
    message: "Status must be one of: pending, in_progress, or completed",
  })
  status: TaskStatus;
}
