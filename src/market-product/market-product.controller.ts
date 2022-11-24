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
import { MarketProductService } from './market-product.service';
import CategoryDto from './market-product.dto';
import { TokenGuard } from 'src/token/token.guard';

@Controller('api/market-product')
export class MarketProductController {
  constructor(private readonly marketProductService: MarketProductService) {}

  @Get('all')
  async getAll() {
    const marketProducts = await this.marketProductService.getAll();
    return {
      marketProducts,
    };
  }

  @UseGuards(TokenGuard)
  @Post()
  async create(@Body() body: CategoryDto) {
    const marketProduct = await this.marketProductService.create(body);
    return {
      marketProduct,
    };
  }

  @UseGuards(TokenGuard)
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: CategoryDto) {
    const response = await this.marketProductService.update(uuid, body);
    return response;
  }

  @UseGuards(TokenGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.marketProductService.deleteById(uuid);
    return response;
  }
}
