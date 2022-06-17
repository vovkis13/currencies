import { Component, OnInit } from '@angular/core';
import { GetCurrenciesService, Rate } from '../shared/get-currencies';
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
export class FormComponent implements OnInit {
  loading: boolean = true;
  options: Currency[] = [Currency.UAH, Currency.USD, Currency.EUR];
  currencies: [Currency, Currency] = [Currency.UAH, Currency.USD];
  values: [number, number] = [0, 0];

  rates: RatesElement[] = [
    { pair: 'UAHUSD', rate: 0 },
    { pair: 'UAHEUR', rate: 0 },
    { pair: 'USDUAH', rate: 0 },
    { pair: 'EURUAH', rate: 0 },
    { pair: 'USDEUR', rate: 0 },
    { pair: 'EURUSD', rate: 0 },
  ];

  constructor(
    private getCurrenciesService: GetCurrenciesService,
    private roundRateService: RoundRateService
  ) {}

  handleValueChange(changedValueNumber: number): void {
    if (this.values[0] < 0 || this.values[1] < 0) {
      this.values.fill(0);
      return;
    }

    const exchangeRate = this.rates.find(
      (ratesElement: RatesElement) =>
        ratesElement.pair === this.currencies.join('')
    )?.rate as number;

    if (changedValueNumber === 0)
      this.values[1] = this.roundRateService.round(
        this.values[0] * exchangeRate
      );
    else
      this.values[0] = this.roundRateService.round(
        this.values[1] / exchangeRate
      );
  }

  handleCurrencyChange(changedCurrencyNumber: number) {
    if (this.currencies[0] === this.currencies[1]) {
      this.currencies[1 - changedCurrencyNumber] =
        this.currencies[changedCurrencyNumber] === Currency.UAH
          ? Currency.USD
          : Currency.UAH;
    }
    this.handleValueChange(changedCurrencyNumber);
  }

  ngOnInit() {
    this.getCurrenciesService.getRates().subscribe((rates: Rate[]) => {
      this.loading = false;
      this.rates[0].rate = 1 / rates[0].sale; //UAHUSD
      this.rates[1].rate = 1 / rates[1].sale; //UAHEUR
      this.rates[2].rate = rates[0].buy; //USDUAH
      this.rates[3].rate = rates[1].buy; //EURUAH
      this.rates[4].rate = rates[0].buy / rates[1].sale; //USDEUR
      this.rates[5].rate = rates[1].buy / rates[0].sale; //EURUSD
    });
  }
}
