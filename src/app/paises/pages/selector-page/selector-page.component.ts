import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { Paises } from '../../interfaces/paises.interfaces';
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
  fronteras: Paises[] = [];

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
          switchMap( pais => this.paisesService.getPaisPorCodigo(pais?.borders!))
        )
        .subscribe(paises => {
          
           // this.fronteras = pais[0].borders
          this.fronteras = paises;
          
          this.cargando = false; 
        })
  }

  guardar(){
    console.log(this.miForm.value);
  }


}
