import { RoleService } from './role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import RoleDto from './role.dto';

@Controller('api/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  async getAll() {
    const roles = await this.roleService.getAll();
    return {
      roles,
    };
  }

  @Post()
  async create(@Body() body: RoleDto) {
    const role = await this.roleService.create(body);
    return {
      role,
    };
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: RoleDto) {
    const response = await this.roleService.update(uuid, body);
    return response;
  }

  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.roleService.deleteById(uuid);
    return response;
  }
}
