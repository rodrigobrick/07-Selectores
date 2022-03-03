import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { PaisCompleto, Paises } from '../../interfaces/paises.interfaces';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miForm: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //llenado de selectores
  regiones : string[] = [];
  paises   : Paises[] = [];
  fronteras: string[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones

    //cuando cambie la region
    this.miForm.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miForm.get('pais')?.reset('');
            this.cargando = true;
          } ),
          switchMap( region => this.paisesService.getPaisesPorRegion(region) )
        )
        .subscribe(paises => {
          this.paises = paises;
          this.cargando = false;
        })
    
    //cuando cambie pais
    this.miForm.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miForm.get('frontera')?.reset('');
            this.cargando = true;
          }), 
          switchMap( codigo => this.paisesService.getPaisPorCca3(codigo) ),
        )
        .subscribe(pais => {
          if( pais.length > 0 ){
            this.fronteras = pais[0].borders || []
          }
          this.cargando = false; 
        })
  }

  guardar(){
    console.log(this.miForm.value);
  }


}
