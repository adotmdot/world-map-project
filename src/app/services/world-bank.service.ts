import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorldBankService {

  private readonly baseUrl =
    'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  // ---------------- COUNTRY INFO ----------------
  getCountryInfo(code: string): Observable<any> {

    const params = new HttpParams()
      .set('format', 'json');

    return this.http.get<any>(
      `${this.baseUrl}/${code}`,
      { params }
    );
  }

  // ---------------- GDP HISTORY ----------------
  getCountryGDPHistory(code: string): Observable<any> {

    const params = new HttpParams()
      .set('format', 'json')
      .set('per_page', '10');

    return this.http.get<any>(
      `${this.baseUrl}/${code}/indicator/NY.GDP.MKTP.CD`,
      { params }
    );
  }

  searchCountries(name: string): Observable<any> {

  return this.http.get<any>(
    `https://restcountries.com/v3.1/name/${name}`
  );
}
}