import { Column, ObjectId, ObjectIdColumn } from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'boolean', default: false })
  delFlg: string;

  @Column({ type: 'varchar', length: 300, default: 'apo' })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;
}
