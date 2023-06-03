import { Decimal } from 'decimal.js'
import { Rarery } from './enums'

export interface Recipe {
  name: string
  factor: number
  rarery: Rarery
}

const recipes: { [id: number]: Recipe } = {
  0: { name: '', factor: 1, rarery: Rarery.r }
}

export class RecipesStore {
  private recipes: { [id: number]: Recipe }

  constructor() {
    this.recipes = recipes
  }

  public getRecipe(recipeId: number): Recipe|undefined {
    return this.recipes[recipeId]
  }

  public calcBonus(points: Decimal, recipes: number[]): Decimal {
    return recipes
      .map(m => this.recipes[m])
      .reduce((p, { factor }) => Decimal.sum(p, new Decimal(new Decimal(points).div(100)).mul(factor)), new Decimal(0))

    // equals: p + ((points / 100) * factor)
  }
}

