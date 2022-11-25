import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import SignUpUserDto from './dto/sign-up.dto';
import User from './user.entity';
import Role from 'src/role/role.entity';
import { TokenService } from 'src/token/token.service';
import SignInUserDto from './dto/sign-in.dto';
import Token from 'src/token/token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
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

    return this.login({
      email: newUser.email,
      password: body.password,
    });
  }

  async login(body: SignInUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: body.email })
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

    return await this.getTokensAndSave(user);
  }

  private hashPassword(password: string) {
    const hash = bcrypt.hashSync(password, 1);

    return hash;
  }

  private async getTokensAndSave(user: User) {
    const token = await this.tokenRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('user.uuid = :uuid', { uuid: user.uuid })
      .getOne();

    const tokens = this.tokenService.generateTokens({
      uuid: user.uuid,
      email: user.email,
      role: user.role.name,
    });

    if (token) {
      await this.tokenRepository.update(
        { uuid: token.uuid },
        {
          token: tokens.refreshToken,
        },
      );
    } else {
      const newToken = await this.tokenRepository.create({
        user,
        token: tokens.refreshToken,
      });

      await this.tokenRepository.save(newToken);
    }

    return tokens;
  }
}
