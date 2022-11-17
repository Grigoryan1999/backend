import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'ormconfig';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { MarketModule } from './market/market.module';
import { MarketProductModule } from './market-product/market-product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configuration.postgresConf),
    ProductModule,
    CategoryModule,
    RoleModule,
    UserModule,
    MarketModule,
    MarketProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
