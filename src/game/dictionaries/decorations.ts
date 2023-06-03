import { Decimal } from 'decimal.js'
import { Rarery } from './enums'

export interface Decoration {
  name: string
  factor: number
  rarery: Rarery
  image: string
}

const decorations: { [id: number]: Decoration } = {
  0: { name: '', factor: 1.2, rarery: Rarery.r, image: '' }
}

export class DecorationsStore {
  private decorations: { [id: number]: Decoration }

  constructor() {
    this.decorations = decorations
  }

  public getDecoration(decorationId: number): Decoration|undefined {
    return this.decorations[decorationId]
  }

  public calcBonus(points: Decimal, decorations: number[]): Decimal {
    return decorations
      .map(m => this.decorations[m])
      .reduce((p, { factor }) => Decimal.sum(p, new Decimal(new Decimal(points).div(100)).mul(factor)), new Decimal(0))

    // equals: p + ((points / 100) * factor)
  }
}