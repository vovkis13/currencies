import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CurrenciesRates, Rate } from '../shared/currencies.service';

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
  currency1: Currency = Currency.UAH;
  currency2: Currency = Currency.USD;
  value1: number = 0;
  value2: number = 0;

  rates: RatesElement[] = [
    { pair: 'UAHUSD', rate: 0 },
    { pair: 'UAHEUR', rate: 0 },
    { pair: 'USDUAH', rate: 0 },
    { pair: 'EURUAH', rate: 0 },
    { pair: 'USDEUR', rate: 0 },
    { pair: 'EURUSD', rate: 0 },
  ];

  constructor(private currenciesService: CurrenciesRates) {
  }

  handleValueChange(changedValueNumber: number) {
    if (this.value1 < 0 || this.value2 < 0) {
      this.value1 = 0;
      this.value2 = 0;
      return;
    }

    const exchangeRate = this.rates.find(
      (ratesElement: RatesElement) =>
        ratesElement.pair === `${this.currency1}${this.currency2}`
    )?.rate as number;
     
    if (changedValueNumber === 1) this.value2 = Math.round(this.value1 * exchangeRate*100)/100;
    else this.value1 = Math.round(this.value2 / exchangeRate*100)/100;
  }

  handleCurrencyChange({ source, value }: MatSelectChange) {
    if (this.currency1 === this.currency2) {
      const newValue = value === Currency.UAH ? Currency.USD : Currency.UAH;
      if (source.ngControl.name === 'currency1') this.currency2 = newValue;
      else this.currency1 = newValue;
    }
    const changedCurrencyNumber = source.ngControl.name === 'currency1' ? 1 : 2;
    this.handleValueChange(changedCurrencyNumber);
  }

  ngOnInit() {
    this.currenciesService.getRates().subscribe((rates: Rate[]) => {
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
