import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from 'src/product/product.entity';
import Market from 'src/market/market.entity';
import { MarketProductController } from './market-product.controller';
import MarketProduct from './market-product.entity';
import { MarketProductService } from './market-product.service';

@Module({
  controllers: [MarketProductController],
  providers: [MarketProductService],
  imports: [TypeOrmModule.forFeature([Market, MarketProduct, Product])],
})
export class MarketProductModule {}
