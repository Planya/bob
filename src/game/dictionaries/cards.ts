import { Decimal } from 'decimal.js'
import { Rarery } from './enums'

export interface Card {
  name: string
  factor: number
  rarery: Rarery
  chance: number
  image: string
}

const cards: { [id: number]: Card } = {
  0: { name: '', factor: 1.2, rarery: Rarery.r, chance: .7, image: '' }
}

export class CardsStore {
  private cards: { [id: number]: Card }

  constructor() {
    this.cards = cards
  }

  public getCard(cardId: number): Card|undefined {
    return this.cards[cardId]
  }

  public calcBonus(points: Decimal, cards: number[]): Decimal {
    return cards
      .map(m => this.cards[m])
      .reduce((p, { factor }) => Decimal.sum(p, new Decimal(new Decimal(points).div(100)).mul(factor)), new Decimal(0))

    // equals: p + ((points / 100) * factor)
  }
}