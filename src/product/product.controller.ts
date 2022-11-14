import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import ProductDto from './product.dto';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async getAll() {
    const products = await this.productService.getAll();
    return {
      products,
    };
  }

  @Get(':uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    const products = await this.productService.getByUuid(uuid);
    return {
      products,
    };
  }

  @Post()
  async create(@Body() body: ProductDto) {
    const product = await this.productService.create(body);
    return {
      product,
    };
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: ProductDto) {
    const response = await this.productService.update(uuid, body);
    return response;
  }

  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.productService.deleteById(uuid);
    return response;
  }
}
