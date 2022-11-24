import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Market {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  latitude: number;

  @Column({ nullable: false })
  longitude: number;

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
