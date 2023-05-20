import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ReactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  channel_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  message_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  emoji: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  role_id: string;
}
