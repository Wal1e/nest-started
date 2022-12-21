import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcryptjs';
/**
 * 使用@PrimaryGeneratedColumn('uuid')创建一个主列id
 */
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 100 })
  nickname: string;

  @Column()
  passport: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encrytPwd() {
    this.passport = await bcrypt.hashSync(this.passport);
  }
}
