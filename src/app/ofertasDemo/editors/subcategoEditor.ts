/**
 * Created by jdominguez on 2/16/17.
 */


import {Component} from "@angular/core";
import {DefaultEditor} from "ng2-smart-table";
import {OfertasData} from "../ofertasDemo.data";
import {CatalogService} from "../../service/catalog.service";
@Component({
  template: '<select2 id="subcatego" (valueChanged)="updateValue($event)" [data]="dataDemo.subCategoData" [options]="select2Options" ></select2>'
})
export class SubCategoEditor extends DefaultEditor {

  private select2Options: any = {
    theme: 'bootstrap',
  };

  constructor(private dataDemo: OfertasData, private catalogService: CatalogService){
    super();
  }

  updateValue(event){
    this.catalogService.getSubCategoriaById(event.value as number).subscribe(
      data => {
        let x = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.cell.newValue = x.nombre;
      }
    );
  }
}
