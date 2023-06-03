import { Decimal } from 'decimal.js'
import { Rarery } from './enums'
import { Bonus as BonusEntity } from 'src/entities/player.entity'

export interface Bonus {
  name: string
  factor: number
  rarery: Rarery
}

const bonuses: { [id: number]: Bonus } = {
  0: { name: '', factor: 1, rarery: Rarery.r }
}

export class BonusesStore {
  private bonuses: { [id: number]: Bonus }

  constructor() {
    this.bonuses = bonuses
  }

  public getBonus(bonuseId: number): Bonus|undefined {
    return this.bonuses[bonuseId]
  }

  public calcBonus(points: Decimal, bonuses: BonusEntity[]): Decimal {
    return bonuses
      .map(({ id, count }) => {
        return {
          ...this.bonuses[id],
          count
        }
      })
      .reduce((p, { factor, count }) => 
        new Decimal(Decimal.sum(p, new Decimal(new Decimal(points).div(100)).mul(factor))).mul(count), 
        new Decimal(0)
      )

    // equals: (p + ((points / 100) * factor)) * count
  }
}