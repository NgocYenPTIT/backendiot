import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Base {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0, name: 'created_at', default: () => 'CURRENT_TIMESTAMP(0)', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(0)', default: () => 'CURRENT_TIMESTAMP(0)', precision: 0, name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
