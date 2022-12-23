import { IProductWithCost } from './../shared/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Category from 'src/category/category.entity';
import CategoryDto from './category.dto';
import MarketProduct from 'src/market-product/market-product.entity';
import { ICategoryWithCost } from 'src/shared/entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'products')
      .leftJoinAndSelect('products.marketProduct', 'marketProducts')
      .leftJoinAndSelect('marketProducts.market', 'markets')
      .getMany();

    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].products.length; j++) {
        let minimalCost = 0;
        minimalCost = categories[i].products[j].marketProduct.reduce(
          (accumulator: number, current: MarketProduct) => {
            return current.cost < accumulator ? current.cost : accumulator;
          },
          minimalCost,
        );
      }
    }

    return categories.map(this.detailedCategoryBuilder);
  }

  async getByUuid(uuid: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.products', 'products')
      .where('category.uuid = :uuid', { uuid })
      .getOne();

    if (!category) {
      throw new HttpException('Category was not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async create(category: CategoryDto) {
    const newCategory = await this.categoryRepository.create({
      name: category.name,
      subscription: category.subscription,
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  async update(uuid: string, category: CategoryDto) {
    const updatedCategory = await this.categoryRepository.findOne({
      where: { uuid },
    });

    if (!updatedCategory) {
      throw new HttpException('Category was not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.update(
      { uuid },
      {
        name: category.name,
        subscription: category.subscription,
      },
    );

    return true;
  }

  async deleteById(uuid: string) {
    const deletedCategory = await this.categoryRepository.findOne({
      where: { uuid },
    });

    if (!deletedCategory) {
      throw new HttpException('Category was not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.delete({ uuid });

    return true;
  }

  private detailedCategoryBuilder = (category: Category): ICategoryWithCost => {
    const productList: IProductWithCost[] = [];
    for (let i = 0; i < category.products.length; i++) {
      let minimalCost = 0;
      minimalCost = category.products[i].marketProduct.reduce(
        (accumulator: number, current: MarketProduct) => {
          return current.cost < accumulator || accumulator === 0
            ? current.cost
            : accumulator;
        },
        minimalCost,
      );

      productList.push({
        uuid: category.products[i].uuid,
        name: category.products[i].name,
        subscription: category.products[i].subscription,
        picture: category.products[i].picture,
        drink: category.products[i].drink,
        updated_at: category.products[i].updated_at,
        created_at: category.products[i].created_at,
        marketProduct: [...category.products[i].marketProduct],
        minimalCost,
      });
    }

    const newCategory: ICategoryWithCost = {
      uuid: category.uuid,
      name: category.name,
      subscription: category.subscription,
      updated_at: category.updated_at,
      created_at: category.created_at,
      products: [...productList],
    };
    return newCategory;
  };
}
