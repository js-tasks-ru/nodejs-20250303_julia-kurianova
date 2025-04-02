import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs(
  "database",
  () =>
    ({
      type: "sqlite",
      database: "./db.sqlite",
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }) as TypeOrmModuleOptions,
);
