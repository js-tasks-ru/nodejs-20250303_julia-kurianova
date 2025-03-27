import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import * as fs from "fs";

export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = exception.status || 500;
    const message = exception.message || "Internal server error";

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${statusCode} - ${message}\n`;

    try {
      fs.appendFileSync("errors.log", logEntry);
    } catch (error) {
      console.error("Failed to write to error log:", error);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp,
    });
  }
}
