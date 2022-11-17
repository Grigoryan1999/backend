import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import CategoryDto from './market.dto';
import { MarketService } from './market.service';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('all')
  async getAll() {
    const markets = await this.marketService.getAll();
    return {
      markets,
    };
  }

  @Get(':uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    const response = await this.marketService.getByUuid(uuid);
    return response;
  }

  @Post()
  async create(@Body() body: CategoryDto) {
    const market = await this.marketService.create(body);
    return {
      market,
    };
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: CategoryDto) {
    const response = await this.marketService.update(uuid, body);
    return response;
  }

  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.marketService.deleteById(uuid);
    return response;
  }
}
