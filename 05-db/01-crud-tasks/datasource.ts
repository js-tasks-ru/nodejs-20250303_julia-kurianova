import database from "config/database";
import { DataSource, DataSourceOptions } from "typeorm";
import { Task } from "./tasks/entities/task.entity"; // ✅ adjust path if needed

const databaseConfig = database();

export default new DataSource({
  ...(databaseConfig as DataSourceOptions),
  migrations: ["./migrations/*.ts"],
  entities: [Task],
});
