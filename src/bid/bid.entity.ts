import BidProduct from 'src/bid_product/bid_product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Bid {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ nullable: false })
  fio: string;

  @Column({ nullable: false })
  comment: string;

  @Column({ nullable: false })
  tel: string;

  @Column({ nullable: false, default: 0 })
  status: number;

  @Column({ nullable: false, type: 'timestamp' })
  endDate: string;

  @ManyToMany(() => BidProduct)
  @JoinTable()
  products: BidProduct[];

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
