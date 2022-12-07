import { IDetailedRole, IStandartResponse } from './../shared/entities';
import { RoleService } from './role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import RoleDto from './role.dto';
import { RoleGuard } from './role.guard';
import { Roles } from './role.decorator';
import { USER_ROLES } from 'src/shared/const';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('api/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Get('all')
  async getAll(): Promise<IStandartResponse<IDetailedRole[]>> {
    const roles = await this.roleService.getAll();
    return {
      message: roles,
    };
  }

  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() body: RoleDto,
  ): Promise<IStandartResponse<IDetailedRole>> {
    const role = await this.roleService.create(body);
    return {
      message: role,
    };
  }

  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() body: RoleDto,
  ): Promise<boolean> {
    const response = await this.roleService.update(uuid, body);
    return response;
  }

  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string): Promise<boolean> {
    const response = await this.roleService.deleteById(uuid);
    return response;
  }
}
