import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcryptjs';
import SignUpUserDto from './dto/sign-up.dto';
import User from './user.entity';
import Role from 'src/role/role.entity';
import { TokenService } from 'src/token/token.service';
import SignInUserDto from './dto/sign-in.dto';
import Token from 'src/token/token.entity';
import { IDetailedToken } from './../shared/entities';

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
    private readonly httpService: HttpService,
  ) {}

  async registration(body: SignUpUserDto): Promise<IDetailedToken> {
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

  async login(body: SignInUserDto): Promise<IDetailedToken> {
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

    if (
      body.password !== '' &&
      !bcrypt.compareSync(body.password, user.password)
    ) {
      throw new HttpException('Wrong email or password', HttpStatus.FORBIDDEN);
    }

    return await this.getTokensAndSave(user);
  }

  async getUserInfo(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'name', 'login', 'uuid'],
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async authThrowVk(code: string) {
    const request = await this.httpService
      .get(
        `https://oauth.vk.com/access_token?client_id=51512872&client_secret=oqtgZgJ7WV7m3nhebwXV&redirect_uri=https://localhost:3001/api/user/vk&code=${code}`,
      )
      .toPromise();

    const accessToken = request.data.access_token;
    const email = request.data.email;
    const userId = request.data.user_id;

    const userInfoRequest = await this.httpService
      .get(
        `https://api.vk.com/method/users.get?user_ids=${userId}&access_token=${accessToken}&v=5.131`,
      )
      .toPromise();

    const user = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (!user) {
      const role = await this.roleRepository.findOne({
        where: { default: true },
      });

      const newUser = await this.userRepository.create({
        name:
          userInfoRequest.data.response[0].first_name +
          ' ' +
          userInfoRequest.data.response[0].last_name,
        login: `vk-${userId}`,
        email,
        role,
        password: '',
      });

      await this.userRepository.save(newUser);
    }
    return this.login({
      email: email,
      password: '',
    });
    //https://oauth.vk.com/authorize?client_id=51512872&display=page&redirect_uri=https://localhost:3001/api/user/vk&scope=email&response_type=code&v=5.131
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
