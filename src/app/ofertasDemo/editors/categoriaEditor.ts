/**
 * Created by jdominguez on 2/16/17.
 */


import {Component, ChangeDetectorRef} from "@angular/core";
import {DefaultEditor} from "ng2-smart-table";
import {OfertasData} from "../ofertasDemo.data";
import {CatalogService} from "../../service/catalog.service";
import {Select2OptionData} from "ng2-select2";

@Component({
  template: '<select2 id="categoria" (valueChanged)="updateValue($event)" [data]="dataDemo.categoriasData" [options]="select2Options" ></select2>'
})
export class CategoriaEditor extends DefaultEditor {

  private select2Options: any = {
    theme: 'bootstrap',
  };

  constructor(private dataDemo: OfertasData, private dc: ChangeDetectorRef, private catalogService: CatalogService){
    super();
  }




  updateValue(event){
    this.catalogService.getCategoriaById(event.value as number).subscribe(
      data => {
        let x = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.cell.newValue = x.nombre;
      }
    );
    this.catalogService.getSubCategoriasByCategoriasId(event.value).then(
      data => {
        this.dataDemo.subCategoData = [{id: '0', text: 'Selecciona'}];
        for (var i: number = 0; i < data.length; i++){
          this.dataDemo.subCategoData.push(
            {id: '' + data[i].subCategoriasId, text: data[i].nombre}
          );
        }
        this.dc.detectChanges();
      }
    );
  }
}
