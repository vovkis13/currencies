import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Rate } from '../shared/get-currencies';
import { RoundRateService } from '../shared/round-rate.service';

enum Currency {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
}

type CurrenciesPair = `${Currency}${Currency}`;

interface RatesElement {
  pair: CurrenciesPair;
  rate: number;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  options: Currency[] = [Currency.UAH, Currency.USD, Currency.EUR];
  currencies: [Currency, Currency] = [Currency.UAH, Currency.USD];
  values: [number, number] = [0, 0];
  rates: RatesElement[] = [];

  constructor(private roundRateService: RoundRateService) {}

  @Input() initialRates: Rate[] = [];
  @Input() loading: boolean = true;

  handleValueChange(changedValueNumber: number): void {
    if (this.values.some((value) => value < 0)) this.values.fill(0);
    else {
      const exchangeRate = this.rates.find(
        (ratesElement: RatesElement) =>
          ratesElement.pair === this.currencies.join('')
      )?.rate as number;

      this.values[1 - changedValueNumber] = this.roundRateService.round(
        this.values[changedValueNumber] *
          (changedValueNumber === 0 ? exchangeRate : 1 / exchangeRate)
      );
    }
  }

  handleCurrencyChange(changedCurrencyNumber: number): void {
    if (this.currencies[0] === this.currencies[1])
      this.currencies[1 - changedCurrencyNumber] =
        this.currencies[changedCurrencyNumber] === Currency.UAH
          ? Currency.USD
          : Currency.UAH;
    this.handleValueChange(changedCurrencyNumber);
  }

  private fillRates(rates: Rate[]) {
    this.rates[0] = { pair: 'UAHUSD', rate: 1 / rates[0].sale };
    this.rates[1] = { pair: 'UAHEUR', rate: 1 / rates[1].sale };
    this.rates[2] = { pair: 'USDUAH', rate: rates[0].buy };
    this.rates[3] = { pair: 'EURUAH', rate: rates[1].buy };
    this.rates[4] = { pair: 'USDEUR', rate: rates[0].buy / rates[1].sale };
    this.rates[5] = { pair: 'EURUSD', rate: rates[1].buy / rates[0].sale };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialRates'].currentValue.length > 0)
      this.fillRates(this.initialRates);
  }
}
