import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TgRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'login', type: 'text'})
  login!: string;

  @Column({name: 'project', type: 'text'})
  project!: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @Column({name: 'telegram_id', type: 'integer'})
  telegramId!: number;

  @Column({name: 'is_fresh', type: 'boolean'})
  isFresh!: boolean;
}
