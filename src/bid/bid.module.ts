import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import Product from 'src/product/product.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import Bid from './bid.entity';
import BidProduct from 'src/bid_product/bid_product.entity';

@Module({
  controllers: [BidController],
  providers: [BidService],
  imports: [TypeOrmModule.forFeature([Bid, BidProduct, Product])],
})
export class BidModule {}
