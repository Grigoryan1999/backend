import Category from 'src/category/category.entity';
import Product from 'src/product/product.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface IConfiguration {
  postgresConf: PostgresConnectionOptions;
}

export const configuration: IConfiguration = {
  postgresConf: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_NAME,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}', Category, Product],
    synchronize: process.env.NODE_ENV !== 'production',
    migrations: ['dist/src/db/migrations/**/*{.ts,.js}'],
    dropSchema: false,
    migrationsRun: true,
    logging: true,
  },
};
