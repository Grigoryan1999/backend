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
import { TokenGuard } from 'src/token/token.guard';
import CategoryDto from './category.dto';
import { CategoryService } from './category.service';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAll() {
    const categories = await this.categoryService.getAll();
    return {
      categories,
    };
  }

  @Get(':uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    const categories = await this.categoryService.getByUuid(uuid);
    return {
      categories,
    };
  }

  @UseGuards(TokenGuard)
  @Post()
  async create(@Body() body: CategoryDto) {
    const category = await this.categoryService.create(body);
    return {
      category,
    };
  }

  @UseGuards(TokenGuard)
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: CategoryDto) {
    const response = await this.categoryService.update(uuid, body);
    return response;
  }

  @UseGuards(TokenGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.categoryService.deleteById(uuid);
    return response;
  }
}
