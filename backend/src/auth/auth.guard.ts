import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { user } from '@prisma/client';

export interface CustomRequestWithId extends Request {
  id?: string; // or whatever custom property you want to add
  // Add any other custom properties you need
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as CustomRequestWithId;

    const accessTokenJWT = request.cookies['accessToken'];
    const refreshTokenJWT = request.cookies['refreshToken'];

    const isUserAuthenticated = await this.authService.handleTokens(
      accessTokenJWT,
      refreshTokenJWT,
    );

    request.id = isUserAuthenticated.data.id;

    if (isUserAuthenticated.isValid) return true;

    throw new UnauthorizedException();
  }
}
