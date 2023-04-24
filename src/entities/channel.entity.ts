import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  channel_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  server_id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_twitch: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_live: boolean;

  @Column({ type: 'timestamptz', default: null })
  last_live_date: Date;
}
