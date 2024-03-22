import { Column, CreateDateColumn, ObjectId, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'boolean', default: false })
  delFlg: boolean;

  @Column({ type: 'varchar', length: 300, default: 'apo' })
  createdBy: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
