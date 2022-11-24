import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Role from 'src/role/role.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

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
