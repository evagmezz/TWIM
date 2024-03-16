import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '../../user/entities/user.entity'

@Injectable()
export class RolesAuthGuard implements CanActivate {
  private readonly logger = new Logger(RolesAuthGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler())
    this.logger.log(`Roles: ${roles}`)
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user
    this.logger.log(`Roles de usuario: ${user.role}`)

    if (user.role === Role.ADMIN) {
      return true
    }

    const hasRole = () =>
      user.roles ? user.roles.some((role) => roles.includes(role)) : false
    return user && user.role && hasRole()
  }
}

export const Roles = (...roles: string[]) => SetMetadata('role', roles)
