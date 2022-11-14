import {
  Column,
  Entity,
  JoinTable,
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

  @Column({ nullable: false })
  drink: boolean;

  @ManyToMany(() => Category)
  @JoinTable()
  categoryes: Category[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: string;
}
