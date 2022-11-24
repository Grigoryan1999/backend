import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Market from 'src/market/market.entity';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import MarketProduct from 'src/market-product/market-product.entity';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [TypeOrmModule.forFeature([Market, MarketProduct])],
})
export class MarketModule {}
