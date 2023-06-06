import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm'
import { Decimal } from 'decimal.js'

export interface PlayerBalance {
  charlotte_points: string|Decimal
  planya_points: string|Decimal
  tokens: number
}

export interface PlayerLevel {
  count: number
  exp: number
}

export interface Bonus {
  id: number
  count: number
}

export interface GameData {
  gacha_cards: number[],
  recipes: number[],
  decorations: number[],
  bonuses: Bonus[]
}

const player_level: PlayerLevel = {
  count: 1,
  exp: 0
}

const player_balance: PlayerBalance = {
  charlotte_points: '0',
  planya_points: '100',
  tokens: 0
}

const gameData: GameData = {
  gacha_cards: [],
  recipes: [0], // по дефолту доступен 1 рецепт
  decorations: [],
  bonuses: []
}

@Entity()
@Unique('unique_player', ['discord_id'])
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  discord_id: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  twitch_channel: string

  @Column({ type: 'int4', nullable: false, default: 0 })
  twitch_messages: number

  @Column({ type: 'int4', nullable: false, default: 0 })
  discord_messages: number

  @Column({ type: 'int4', nullable: false, default: 1 })
  progress_level: number

  @Column({ type: 'jsonb', nullable: false, default: player_level })
  player_level: PlayerLevel

  @Column({ type: 'jsonb', nullable: false, default: player_balance })
  player_balance: PlayerBalance

  @Column({ type: 'jsonb', nullable: false, default: gameData })
  game_data: GameData

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date
}
