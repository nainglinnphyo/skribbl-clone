import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @Column({ type: 'varchar' })
  roomCode: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
