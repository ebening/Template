
import { Component, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';

import {MediosAdminData} from "./medios-admin.data";
import {UtilService} from '../../service/util.service';
import {VigenciaEditor} from "./editors/vigenciaEditor";
import {CategoriaEditor} from "./editors/categoriaEditor";
import {SubCategoEditor} from "./editors/subcategoEditor";
import {CatalogService} from '../../service/catalog.service';
import {LocalDataSource} from "ng2-smart-table";
import {Eventos} from '../../model/Eventos';
import {StructureService} from '../../service/structure.service';
import {ActivatedRoute} from "@angular/router";

declare var REDIPS: any;

declare let XLSX: any;

interface SmartColumn {
  [name: string]: {};
}


@Component({
  selector: '[medios-admin]',
  templateUrl: './medios-admin.template.html',
  styleUrls: ['./medios-admin.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MediosAdmin implements AfterViewInit {


  private sourceTableOfertas: LocalDataSource;

  private widthdivTable: string = '4500px';
  private fixWidth: number = 160;

  private settingsTable;
  private settingsTableCombo;
  private fechaSelected: Date = new Date();
  private fechaInicialOpts: any = {};
  private hasBaseDropZoneOver: boolean = false;

    public rd: any = REDIPS.drag;
    public counter: number = 0;
    public clonedDIV: boolean = false;
    public lastCell: any;
    public columnas: number[] = new Array(6);
    public paginas: Pagina[] = [];



    constructor() {

        for(var i = 1; i <= 5; i++){
            var pagina: Pagina = new Pagina();
            pagina.numero=i;
            this.paginas.push(pagina);
            pagina.lineas = [];
            var totalItems = 18;
            var numLineas = Math.ceil(totalItems/this.columnas.length);
            var itemNum = 1;
            for(var lineaIndex=0; lineaIndex < numLineas; lineaIndex++){
                var linea: Linea = new Linea();
                linea.items = [];
                pagina.lineas.push(linea);
                for(var itemIndex=0; itemIndex < this.columnas.length; itemIndex++){
                    var item: Item = new Item();
                    item.nombre = 'Producto Pag '+i+', Item '+itemNum;
                    item.precio =  Math.floor((Math.random() * 1000) + 1) + Math.random();
                    item.imageNumber = Math.floor((Math.random() * 10) + 1);
                    linea.items.push(item);
                    itemNum++;
                    if(itemNum>totalItems){
                        break;
                    }
                }
            }
        }
    }

    ngAfterViewInit() {
        this.lastCell = document.getElementById('lastCell');
        this.rd.init();
        this.rd.shift.animation = true;
        this.rd.style.opacityDisabled = 50;
        this.rd.hover.colorTd = '#9BB3DA';
        this.rd.event.droppedBefore = (targetCell: any) => {
            var empty = this.rd.emptyCell(targetCell, 'test');
            if (!empty) {
                this.rd.obj.parentNode.removeChild(this.rd.obj);
                this.rd.enableDrag(true, this.rd.td.target);
                if (!this.clonedDIV) {
                    this.rd.relocate(this.rd.td.target, this.rd.td.source);
                    this.rd.td.target.appendChild(this.rd.obj);
                }
                return false;
            }
        };
        this.rd.event.cloned = () => {
            this.counter++;
            this.rd.obj.innerHTML += this.counter;
        };
        this.rd.event.moved = (cloned: any) => {
            this.clonedDIV = cloned;
        };
    }

}

class Pagina {
    public numero: number;
    public lineas: Linea[];
}

class Linea{
    public items: Item[];
}

class Item {
    public imageNumber: number;
    public nombre: string;
    public precio: number;
}
