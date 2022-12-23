import { ORDER_STATUS } from './../shared/const';
import BidProduct from 'src/bid_product/bid_product.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Bid from './bid.entity';
import CreateBidDto from './dto/create-bid.dto';
import Product from 'src/product/product.entity';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(BidProduct)
    private bidProductRepository: Repository<BidProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    const bids = await this.bidRepository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .getMany();

    return bids;
  }

  async create(body: CreateBidDto) {
    const newBid = await this.bidRepository.create({
      ...body,
      endDate: body.endDate,
    });
    body.products.forEach(async (bidProductElement) => {
      const newBidProduct = await this.bidProductRepository.create({
        count: bidProductElement.count,
        product: await this.productRepository.findOne({
          where: {
            uuid: bidProductElement.productUuid,
          },
        }),
      });

      await this.bidProductRepository.save(newBidProduct);
      newBid.products = [...newBid.products, newBidProduct];
      await this.bidRepository.save(newBid);
    });

    return true;
  }

  async changeBidStatus(uuid: string, status: ORDER_STATUS) {
    const updatedBid = await this.bidRepository.findOne({
      where: { uuid },
    });

    if (!updatedBid) {
      throw new HttpException('Bid was not found', HttpStatus.NOT_FOUND);
    }

    await this.bidRepository.update(
      { uuid },
      {
        status,
      },
    );

    return true;
  }

  async deleteById(uuid: string) {
    const bid = await this.bidRepository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .where('bid.uuid = :uuid', { uuid })
      .getOne();

    if (!bid) {
      throw new HttpException('Bid was not found', HttpStatus.NOT_FOUND);
    }

    bid.products.forEach(async (bidProductElement: BidProduct) => {
      await this.bidProductRepository.delete({
        uuid: bidProductElement.product.uuid,
      });
    });

    await this.bidRepository.delete({ uuid });

    return true;
  }
}
