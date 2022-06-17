import { Component, OnInit } from '@angular/core';
import { CurrenciesRates } from '../shared/currencies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loading: boolean = true;
  usdRatesString: string = '';
  eurRatesString: string = '';

  constructor(private currenciesService: CurrenciesRates) {}

  private roundRate = (rate: number): number => Math.round(rate * 100) / 100;

  ngOnInit(): void {
    this.currenciesService.getRates().subscribe((rates) => {
      this.loading = false;
      this.usdRatesString = `${this.roundRate(
        rates[0].buy
      )} / ${this.roundRate(rates[0].sale)}`;
      this.eurRatesString = `${this.roundRate(
        rates[1].buy
      )} / ${this.roundRate(rates[1].sale)}`;
    });
  }
}
