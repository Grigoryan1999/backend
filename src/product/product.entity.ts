import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Category from 'src/category/category.entity';

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  subscription: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: false, default: 0 })
  cost: number;

  @Column({ nullable: false })
  drink: boolean;

  @Column({ nullable: false, default: 0 })
  count: number;

  @ManyToMany(() => Category)
  categories: Category[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: string;
}
