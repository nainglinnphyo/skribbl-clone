/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'user@gmail.com' })
  email: string;

  @ApiProperty({ default: '123456' })
  password: string;
}
