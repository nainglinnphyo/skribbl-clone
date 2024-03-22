/* eslint-disable import/no-cycle */
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  roomCode: string;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[];
}
