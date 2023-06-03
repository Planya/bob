import { Decimal } from 'decimal.js'

/** Класс для конвертирования больших чисел */
export class CurrencyHelper {
  public toDecimal(value: string): Decimal {
    return new Decimal(value)
  }

  public toString(decimal: Decimal): string {
    return decimal.toJSON()
  }
}