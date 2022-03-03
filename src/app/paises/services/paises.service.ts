import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisCompleto, Paises } from '../interfaces/paises.interfaces';

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

  getPaisPorCca3( codigo: string ): Observable<PaisCompleto | null> {

    if( !codigo ){
      return of(null)
    }

    const url: string = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisCompleto>(url);
  }

  getPaisFrontera( codigo: string ): Observable<Paises> {
    const url = `${this.baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<Paises>(url);
  }

  getPaisPorCodigo( borders: string[] ): Observable<Paises[]>{
    
    if(!borders){
      return of([])
    }

    const peticiones: Observable<Paises>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisFrontera(codigo);
      peticiones.push(peticion)
    });

    return combineLatest( peticiones );
  }

}
