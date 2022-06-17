import { Component, OnInit } from '@angular/core';
import { GetCurrenciesService, Rate } from './shared/get-currencies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  initialRates: Rate[] = [];
  loading: boolean = true;

  constructor(private getCurrenciesService: GetCurrenciesService) {}

  ngOnInit(): void {
    this.getCurrenciesService.getRates().subscribe((rates) => {
      this.loading = false;
      this.initialRates = rates.slice(0, 2);
    });
  }
}

