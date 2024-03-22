import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller({
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getAllUser();
  }
}
