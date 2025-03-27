import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers["x-role"] !== "admin") {
      throw new ForbiddenException("Доступ запрещён: требуется роль admin");
    }
    return true;
  }
}
