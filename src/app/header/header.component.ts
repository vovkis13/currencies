import { Component, OnInit } from '@angular/core';
import { GetCurrenciesService } from '../shared/get-currencies';
import { RoundRateService } from '../shared/round-rate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loading: boolean = true;
  usdRatesString: string = '';
  eurRatesString: string = '';

  constructor(private getCurrenciesService: GetCurrenciesService,
    private roundRateService: RoundRateService) { }

  ngOnInit(): void {
    this.getCurrenciesService.getRates().subscribe((rates) => {
      this.loading = false;
      this.usdRatesString = `${this.roundRateService.round(
        rates[0].buy
      )} / ${this.roundRateService.round(rates[0].sale)}`;
      this.eurRatesString = `${this.roundRateService.round(
        rates[1].buy
      )} / ${this.roundRateService.round(rates[1].sale)}`;
    });
  }
}
