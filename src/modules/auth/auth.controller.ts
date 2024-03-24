import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { BadRequestException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { IResponse } from '@app/core/interfaces/response.interface';
import { CurrentUser } from '@app/core/decorators/auth.decorators';
import { User } from '@app/core/common/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
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
    const existUser = await this.authService.checkUserExist(body.email);
    if (existUser) {
      throw new BadRequestException({
        message: 'user already exist',
        code: ExceptionConstants.BadRequestCodes.CONFLICT_EMAIL,
      });
    }
    const newUser = await this.authService.register(body);
    const token = await this.authService.generateToken({ userId: newUser.insertedId, email: newUser.email });
    return {
      _metadata: {
        message: 'register success',
        statusCode: HttpStatus.OK,
      },
      _data: { token },
    };
  }

  @Get('user/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async validateUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('user/login')
  @ApiBearerAuth()
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto): Promise<IResponse> {
    const existUser = await this.authService.checkUserExist(dto.email);
    if (!existUser) {
      throw new BadRequestException({
        message: "user don't exist",
        code: ExceptionConstants.UnauthorizedCodes.USER_NOT_VERIFIED,
      });
    }
    const checkPass = await this.authService.verifyPassword(dto);
    if (!checkPass) {
      throw new BadRequestException({
        message: "password don't match",
        code: ExceptionConstants.UnauthorizedCodes.INVALID_RESET_PASSWORD_TOKEN,
      });
    }
    const token = await this.authService.generateToken({ userId: existUser.id, email: existUser.email });
    return {
      _metadata: {
        message: 'login success',
        statusCode: HttpStatus.OK,
      },
      _data: { token },
    };
  }
}
