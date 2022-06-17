import { Component, Input, SimpleChanges } from '@angular/core';
import { Rate } from '../shared/get-currencies';
import { RoundRateService } from '../shared/round-rate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  usdRatesString: string = '';
  eurRatesString: string = '';

  constructor(private roundRateService: RoundRateService) {}

  @Input() initialRates: Rate[] = [];
  @Input() loading: boolean = true;

  ngOnChanges({ initialRates }: SimpleChanges) {
    if (initialRates.currentValue.length > 0) {
      this.usdRatesString = `${this.roundRateService.round(
        this.initialRates[0].buy
      )} / ${this.roundRateService.round(this.initialRates[0].sale)}`;
      this.eurRatesString = `${this.roundRateService.round(
        this.initialRates[1].buy
      )} / ${this.roundRateService.round(this.initialRates[1].sale)}`;
    }
  }
}
