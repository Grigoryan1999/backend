import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import SignUpUserDto from './dto/sign-up.dto';
import User from './user.entity';
import Role from 'src/role/role.entity';
import { TokenService } from 'src/token/token.service';
import SignInUserDto from './dto/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly tokenService: TokenService,
  ) {}

  async registration(body: SignUpUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ login: body.login }, { email: body.email }],
    });

    if (user) {
      throw new HttpException(
        'Login or email was already used',
        HttpStatus.FORBIDDEN,
      );
    }

    const role = await this.roleRepository.findOne({
      where: { default: true },
    });

    const password = this.hashPassword(body.password);

    const newUser = await this.userRepository.create({
      name: body.name,
      login: body.login,
      email: body.email,
      role,
      password,
    });

    await this.userRepository.save(newUser);

    const tokens = this.tokenService.generateTokens({
      uuid: newUser.uuid,
      email: newUser.email,
      role: role.name,
    });

    return tokens;
  }

  async login(body: SignInUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException(
        'Login or email was not found',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = this.tokenService.generateTokens({
      uuid: user.uuid,
      email: user.email,
      role: user.role.name,
    });

    return tokens;
  }

  private hashPassword(password: string) {
    const hash = bcrypt.hashSync(password, 1);

    return hash;
  }
}
