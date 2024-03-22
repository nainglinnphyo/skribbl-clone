/* eslint-disable import/no-extraneous-dependencies */
import { UnauthorizedException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: ExceptionConstants.UnauthorizedCodes.ACCESS_TOKEN_EXPIRED,
        description: 'Invalid or Expire token',
      });
    }
    return user;
  }
}
