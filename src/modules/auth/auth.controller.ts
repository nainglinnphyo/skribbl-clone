import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { BadRequestException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { IResponse } from '@app/core/interfaces/response.interface';
import { CurrentUser } from '@app/core/decorators/auth.decorators';
import { User } from '@app/core/common/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/user/register')
  @ApiBody({ type: RegisterDto })
  async userRegister(@Body() body: RegisterDto): Promise<IResponse> {
    const userExist = await this.authService.checkUserExist(body.email);
    if (userExist) {
      throw new BadRequestException({
        message: 'user already exist',
        code: ExceptionConstants.BadRequestCodes.CONFLICT_EMAIL,
      });
    }
    const newUser = await this.authService.register(body);
    const token = await this.authService.generateToken({ userId: newUser._id.toString(), email: newUser.email });
    return {
      _metadata: {
        message: 'Register Success',
        statusCode: 200,
      },
      // 65fd3fa9d1d9b17bf2522232
      // 65fd3fbbd1d9b17bf2522233
      _data: {
        accessToken: token,
      },
    };
  }

  @Get('user/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
