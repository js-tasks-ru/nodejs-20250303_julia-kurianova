import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiVersionInterceptor } from "interceptors/api-version.interceptor";
import { HttpErrorFilter } from "filters/http-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new ApiVersionInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
