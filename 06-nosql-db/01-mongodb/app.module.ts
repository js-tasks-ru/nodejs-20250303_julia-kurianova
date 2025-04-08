import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
// Enable Mongoose debug mode globally
mongoose.set("debug", true);

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/05-db-02-mongodb"),
    TasksModule,
  ],
})
export class AppModule {}
