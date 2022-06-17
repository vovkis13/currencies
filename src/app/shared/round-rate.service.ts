import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoundRateService {

  constructor() { }

  round = (rate: number): number => Math.round(rate * 100) / 100;

}
