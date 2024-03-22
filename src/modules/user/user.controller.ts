import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller({
  version: '1',
})
export class UserController {
  constructor(private configService: ConfigService) {}

  @Get()
  getUser() {
    return 'get user endpoint';
  }
}
