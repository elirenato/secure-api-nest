import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

export class FakeAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    _context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = _context.switchToHttp().getRequest();
    let jwtToken = (request.headers.authorization || '').split(' ');
    if (jwtToken.length < 2) {
      throw new UnauthorizedException();
    }
    const rolesAnnotation: any = this.reflector.get<string[]>(
      'roles',
      _context.getHandler(),
    );
    if (rolesAnnotation && rolesAnnotation.roles) {
      jwtToken = jwt.decode(jwtToken[1]);
      let hasRole = false;
      if (jwtToken && jwtToken.realm_access && jwtToken.realm_access.roles) {
        rolesAnnotation.roles.forEach((roleRequired) => {
          jwtToken.realm_access.roles.forEach((rolePresent) => {
            if (roleRequired === `realm:${rolePresent}`) {
              hasRole = true;
              return true;
            }
          });
          if (hasRole) {
            return true;
          }
        });
      }
      if (!hasRole) {
        throw new ForbiddenException();
      }
    }
    return true;
  }
}
