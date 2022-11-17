import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import MarketProduct from 'src/market-product/market-product.entity';
import MarketProductDto from './market-product.dto';
import Market from 'src/market/market.entity';
import Product from 'src/product/product.entity';

@Injectable()
export class MarketProductService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(MarketProduct)
    private marketProductRepository: Repository<MarketProduct>,
  ) {}

  async getAll() {
    const marketProducts = await this.marketProductRepository
      .createQueryBuilder('marketProduct')
      .leftJoinAndSelect('marketProduct.product', 'product')
      .leftJoinAndSelect('marketProduct.market', 'market')
      .getMany();

    return marketProducts;
  }

  async create(marketProduct: MarketProductDto) {
    const market = await this.marketRepository.findOne({
      where: { uuid: marketProduct.marketUuid },
    });
    const product = await this.productRepository.findOne({
      where: { uuid: marketProduct.productUuid },
    });

    if (!market) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    if (!product) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    const marketProductEntity = await this.marketProductRepository
      .createQueryBuilder('marketProduct')
      .where('marketProduct.market = :marketUuid', {
        marketUuid: marketProduct.marketUuid,
      })
      .andWhere('marketProduct.product = :productUuid', {
        productUuid: marketProduct.productUuid,
      })
      .getOne();

    if (marketProductEntity) {
      throw new HttpException(
        'MarketProduct was alredy added',
        HttpStatus.FORBIDDEN,
      );
    }

    const newMarketProduct = await this.marketProductRepository.create({
      market,
      product,
      count: marketProduct.count,
    });

    await this.marketProductRepository.save(newMarketProduct);

    return newMarketProduct;
  }

  async update(uuid: string, marketProduct: MarketProductDto) {
    const updatedMarketProduct = await this.marketProductRepository.findOne({
      where: { uuid },
    });
    const market = await this.marketRepository.findOne({
      where: { uuid: marketProduct.marketUuid },
    });
    const product = await this.productRepository.findOne({
      where: { uuid: marketProduct.productUuid },
    });

    if (!market) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    if (!product) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    if (!updatedMarketProduct) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    await this.marketProductRepository.update(
      { uuid },
      {
        count: marketProduct.count,
      },
    );

    return true;
  }

  async deleteById(uuid: string) {
    const deletedMarketProduct = await this.marketProductRepository.findOne({
      where: { uuid },
    });

    if (!deletedMarketProduct) {
      throw new HttpException(
        'MarketProduct was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.marketProductRepository.delete({ uuid });

    return true;
  }
}
