import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import Category from 'src/category/category.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import Product from 'src/product/product.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, Category])],
})
export class ProductModule {}
