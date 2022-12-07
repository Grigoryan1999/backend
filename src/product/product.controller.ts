import { IDetailedProduct } from 'src/shared/entities';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import ProductDto from './product.dto';
import { ProductService } from './product.service';
import { IStandartResponse } from './../shared/entities';
import { RoleGuard } from './../role/role.guard';
import { USER_ROLES } from './../shared/const';

@ApiTags('Product')
@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async getAll(): Promise<IStandartResponse<IDetailedProduct[]>> {
    const products = await this.productService.getAll();
    return {
      message: products,
    };
  }

  @Get(':uuid')
  async getByUuid(
    @Param('uuid') uuid: string,
  ): Promise<IStandartResponse<IDetailedProduct>> {
    const product = await this.productService.getByUuid(uuid);
    return {
      message: product,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() body: ProductDto,
  ): Promise<IStandartResponse<IDetailedProduct>> {
    const product = await this.productService.create(body);
    return {
      message: product,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post('add-to-category')
  async addToCategory(@Body() body): Promise<boolean> {
    const response = await this.productService.addToCategory(
      body.productUuid,
      body.categoryUuid,
    );
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post('remove-from-category')
  async removeToCategory(@Body() body): Promise<boolean> {
    const response = await this.productService.removeFromCategory(
      body.productUuid,
      body.categoryUuid,
    );
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() body: ProductDto,
  ): Promise<boolean> {
    const response = await this.productService.update(uuid, body);
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string): Promise<boolean> {
    const response = await this.productService.deleteById(uuid);
    return response;
  }
}
