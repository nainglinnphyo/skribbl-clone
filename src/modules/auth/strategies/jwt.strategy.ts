/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: { userId: string; email: string; iat: number }) {
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: ExceptionConstants.UnauthorizedCodes.ACCESS_TOKEN_EXPIRED,
        description: 'Invalid or Expire token',
      });
    }
    return user._data.user;
  }
}
