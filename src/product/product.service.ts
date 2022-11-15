import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductDto from './product.dto';
import Product from './product.entity';
import Category from 'src/category/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .getMany();

    return products;
  }

  async getByUuid(uuid: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
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

  async addToCategory(productUuid: string, categoryUuid: string) {
    const product = await this.productRepository.findOne({
      where: { uuid: productUuid },
    });

    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'products')
      .where('category.uuid = :uuid', { uuid: categoryUuid })
      .getOne();

    if (!product) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    if (!category) {
      throw new HttpException('Category was not found', HttpStatus.NOT_FOUND);
    }

    if (category.products && category.products.length > 0) {
      category.products = [...category.products, product];
    } else {
      category.products = [product];
    }

    await this.categoryRepository.save(category);

    return true;
  }

  async removeFromCategory(productUuid: string, categoryUuid: string) {
    const product = await this.productRepository.findOne({
      where: { uuid: productUuid },
    });

    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'products')
      .where('category.uuid = :uuid', { uuid: categoryUuid })
      .getOne();

    if (!product) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    if (!category) {
      throw new HttpException('Category was not found', HttpStatus.NOT_FOUND);
    }

    if (category.products) {
      category.products = category.products.filter(
        (product: Product) => product.uuid !== productUuid,
      );

      await this.categoryRepository.save(category);
    }

    return true;
  }
}
