import MarketProduct from 'src/market-product/market-product.entity';
import Market from 'src/market/market.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MarketDto from './market.dto';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(MarketProduct)
    private marketProductRepository: Repository<MarketProduct>,
  ) {}

  async getAll() {
    const markets = await this.marketRepository
      .createQueryBuilder('market')
      .getMany();

    return markets;
  }

  async getByUuid(uuid: string) {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where('market.uuid = :uuid', { uuid })
      .getOne();

    const products = await this.marketProductRepository
      .createQueryBuilder('marketProduct')
      .innerJoinAndSelect('marketProduct.product', 'product')
      .where('marketProduct.market = :uuid', { uuid })
      .getMany();

    if (!market) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    return {
      market,
      products,
    };
  }

  async create(market: MarketDto) {
    const newMarket = await this.marketRepository.create({
      address: market.address,
      latitude: market.latitude,
      longitude: market.longitude,
    });

    await this.marketRepository.save(newMarket);

    return newMarket;
  }

  async update(uuid: string, market: MarketDto) {
    const updatedMarket = await this.marketRepository.findOne({
      where: { uuid },
    });

    if (!updatedMarket) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    await this.marketRepository.update(
      { uuid },
      {
        address: market.address,
        latitude: market.latitude,
        longitude: market.longitude,
      },
    );

    return true;
  }

  async deleteById(uuid: string) {
    const deletedMarket = await this.marketRepository.findOne({
      where: { uuid },
    });

    if (!deletedMarket) {
      throw new HttpException('Market was not found', HttpStatus.NOT_FOUND);
    }

    await this.marketRepository.delete({ uuid });

    return true;
  }
}
