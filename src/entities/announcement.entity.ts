import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AnnouncementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  channel_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  server_id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  ping: boolean;
}
