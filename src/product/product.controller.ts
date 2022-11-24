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
import { TokenGuard } from 'src/token/token.guard';
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

  @UseGuards(TokenGuard)
  @Post()
  async create(@Body() body: ProductDto) {
    const product = await this.productService.create(body);
    return {
      product,
    };
  }

  @UseGuards(TokenGuard)
  @Post('add-to-category')
  async addToCategory(@Body() body) {
    const response = await this.productService.addToCategory(
      body.productUuid,
      body.categoryUuid,
    );
    return response;
  }

  @UseGuards(TokenGuard)
  @Post('remove-from-category')
  async removeToCategory(@Body() body) {
    const response = await this.productService.removeFromCategory(
      body.productUuid,
      body.categoryUuid,
    );
    return response;
  }

  @UseGuards(TokenGuard)
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: ProductDto) {
    const response = await this.productService.update(uuid, body);
    return response;
  }

  @UseGuards(TokenGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.productService.deleteById(uuid);
    return response;
  }
}
