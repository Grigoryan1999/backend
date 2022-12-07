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
import CategoryDto from './market.dto';
import { MarketService } from './market.service';
import { IDetailedMarket } from 'src/shared/entities';
import { IMarketWithProducts, IStandartResponse } from './../shared/entities';

@ApiTags('Market')
@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('all')
  async getAll(): Promise<IStandartResponse<IDetailedMarket[]>> {
    const markets = await this.marketService.getAll();
    return {
      message: markets,
    };
  }

  @Get(':uuid')
  async getByUuid(
    @Param('uuid') uuid: string,
  ): Promise<IStandartResponse<IMarketWithProducts>> {
    const response = await this.marketService.getByUuid(uuid);
    return {
      message: response,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() body: CategoryDto,
  ): Promise<IStandartResponse<IDetailedMarket>> {
    const market = await this.marketService.create(body);
    return {
      message: market,
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
    const response = await this.marketService.update(uuid, body);
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string): Promise<boolean> {
    const response = await this.marketService.deleteById(uuid);
    return response;
  }
}
