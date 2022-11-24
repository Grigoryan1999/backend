import Category from 'src/category/category.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CategoryDto from './category.dto';

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
      .getMany();

    return categories;
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
}
