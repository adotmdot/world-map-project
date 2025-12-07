import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  private readonly baseUrl = 'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  
  getCountryInfo(code: string): Observable<any> {
    const params = new HttpParams().set('format', 'json');
    return this.http.get<any>(`${this.baseUrl}/${code}`, { params });
  }
}
