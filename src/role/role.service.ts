import { IDetailedRole } from './../shared/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RoleDto from './role.dto';
import Role from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<IDetailedRole[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .getMany();

    return roles;
  }

  async create(role: RoleDto): Promise<IDetailedRole> {
    const newRole = await this.roleRepository.create({
      name: role.name,
      default: role.default,
    });

    await this.roleRepository.save(newRole);

    return newRole;
  }

  async update(uuid: string, role: RoleDto): Promise<boolean> {
    const updatedRole = await this.roleRepository.findOne({
      where: { uuid },
    });

    if (!updatedRole) {
      throw new HttpException('Role was not found', HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.update(
      { uuid },
      {
        name: role.name,
        default: role.default,
      },
    );

    return true;
  }

  async deleteById(uuid: string): Promise<boolean> {
    const deletedRole = await this.roleRepository.findOne({
      where: { uuid },
    });

    if (!deletedRole) {
      throw new HttpException('Role was not found', HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.delete({ uuid });

    return true;
  }
}
