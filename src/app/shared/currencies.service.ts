import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Rate {
  buy: number;
  sale: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrenciesRates {
  static url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

  constructor(private http: HttpClient) {}

  getRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(CurrenciesRates.url);
  }
}
