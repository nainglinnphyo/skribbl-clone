import { User } from '@app/core/common/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IResponse } from '@app/core/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(userId: string): Promise<IResponse> {
    const objectId = new ObjectId(userId);
    return {
      _metadata: {
        message: '',
        statusCode: 200,
      },
      _data: {
        user: await this.usersRepository.findOneOrFail({ where: { _id: objectId }, select: { _id: true, email: true } }),
      },
    };
  }

  async checkUserExist(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(dto: { username: string; email: string; password: string }) {
    const newUser = new User();
    newUser.email = dto.email;
    newUser.username = dto.username;
    newUser.password = dto.password;
    return this.usersRepository.save(newUser);
  }

  generateToken(payload: { userId: string; email: string }) {
    return this.jwtService.signAsync(payload, {
      secret: 'secret',
    });
  }

  async login(dto: { email: string; password: string }): Promise<IResponse> {
    const data = await this.usersRepository.findOneOrFail({
      where: {
        email: dto.email,
        password: dto.password,
      },
    });
    const token = await this.generateToken({ userId: data._id.toString(), email: data.email });
    return {
      _data: { ...data, token },
      _metadata: {
        message: 'login success',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
