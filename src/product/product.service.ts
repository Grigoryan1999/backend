import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductDto from './product.dto';
import Product from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.categoryes', 'categoryes')
      .getMany();

    return products;
  }

  async getByUuid(uuid: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.categoryes', 'categoryes')
      .where('product.uuid = :uuid', { uuid })
      .getOne();

    if (!product) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async create(product: ProductDto) {
    const newProduct = await this.productRepository.create({
      name: product.name,
      subscription: product.subscription,
      drink: product.drink,
    });

    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async update(uuid: string, product: ProductDto) {
    const updatedProduct = await this.productRepository.findOne({
      where: { uuid },
    });

    if (!updatedProduct) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.update(
      { uuid },
      {
        name: product.name,
        subscription: product.subscription,
        drink: product.drink,
      },
    );

    return true;
  }

  async deleteById(uuid: string) {
    const deletedProduct = await this.productRepository.findOne({
      where: { uuid },
    });

    if (!deletedProduct) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.delete({ uuid });

    return true;
  }
}
