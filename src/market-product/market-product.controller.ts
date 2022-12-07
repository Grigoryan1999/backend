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
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { USER_ROLES } from 'src/shared/const';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  IDetailedMarketProduct,
  IDetailedMarketProductWithMarket,
  IStandartResponse,
} from 'src/shared/entities';

@ApiTags('Market product')
@Controller('api/market-product')
export class MarketProductController {
  constructor(private readonly marketProductService: MarketProductService) {}

  @Get('all')
  async getAll(): Promise<
    IStandartResponse<IDetailedMarketProductWithMarket[]>
  > {
    const marketProducts = await this.marketProductService.getAll();
    return {
      message: marketProducts,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MARKET_OWNER)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() body: CategoryDto,
  ): Promise<IStandartResponse<IDetailedMarketProduct>> {
    const marketProduct = await this.marketProductService.create(body);
    return {
      message: marketProduct,
    };
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MARKET_OWNER)
  @UseGuards(RoleGuard)
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() body: CategoryDto) {
    const response = await this.marketProductService.update(uuid, body);
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MARKET_OWNER)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string) {
    const response = await this.marketProductService.deleteById(uuid);
    return response;
  }
}
