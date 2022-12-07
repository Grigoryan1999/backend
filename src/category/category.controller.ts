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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { USER_ROLES } from 'src/shared/const';
import CategoryDto from './category.dto';
import { CategoryService } from './category.service';
import { IDetailedCategory, IStandartResponse } from './../shared/entities';

@ApiTags('Category')
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAll(): Promise<IStandartResponse<IDetailedCategory[]>> {
    const categories = await this.categoryService.getAll();
    return {
      message: categories,
    };
  }

  @Get(':uuid')
  async getByUuid(
    @Param('uuid') uuid: string,
  ): Promise<IStandartResponse<IDetailedCategory>> {
    const category = await this.categoryService.getByUuid(uuid);
    return {
      message: category,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() body: CategoryDto,
  ): Promise<IStandartResponse<IDetailedCategory>> {
    const category = await this.categoryService.create(body);
    return {
      message: category,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() body: CategoryDto,
  ): Promise<boolean> {
    const response = await this.categoryService.update(uuid, body);
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string): Promise<boolean> {
    const response = await this.categoryService.deleteById(uuid);
    return response;
  }
}
