import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paises } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v3.1/';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones]
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string): Observable<Paises[]> {

    const url: string = `${ this.baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<Paises[]>(url)
  }
}
