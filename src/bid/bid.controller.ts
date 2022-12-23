import { IDetailedBid } from './../shared/entities';
import { BidService } from './bid.service';
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
import { IStandartResponse } from 'src/shared/entities';
import CreateBidDto from './dto/create-bid.dto';
import { Roles } from 'src/role/role.decorator';
import { ORDER_STATUS, USER_ROLES } from 'src/shared/const';
import { RoleGuard } from 'src/role/role.guard';

@ApiTags('Bid')
@Controller('api/bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MARKET_OWNER)
  @UseGuards(RoleGuard)
  @Get('all')
  async getAll(): Promise<IStandartResponse<IDetailedBid[]>> {
    const bids = await this.bidService.getAll();
    return {
      message: bids,
    };
  }

  @Post()
  async create(@Body() body: CreateBidDto): Promise<boolean> {
    const response = await this.bidService.create(body);
    return response;
  }

  @Put(':uuid')
  async changeBidStatus(
    @Param(':uuid') uuid: string,
    @Body()
    body: {
      status: ORDER_STATUS;
    },
  ): Promise<boolean> {
    const response = await this.bidService.changeBidStatus(uuid, body.status);
    return response;
  }

  @ApiBearerAuth()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MARKET_OWNER)
  @UseGuards(RoleGuard)
  @Delete(':uuid')
  async deleteById(@Param('uuid') uuid: string): Promise<boolean> {
    const response = await this.bidService.deleteById(uuid);
    return response;
  }
}
