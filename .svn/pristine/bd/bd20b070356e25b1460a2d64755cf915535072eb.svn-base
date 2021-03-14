/**
 * Created by edgar on 02/03/17.
 */


import {Component, ViewEncapsulation, ViewContainerRef} from "@angular/core";
import {IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption} from "../shared/multiselect-dropdown";
import {ServerDataSource} from "ng2-smart-table";
import { tableData, mediosData } from './medios-admin-table.data';
import {Http} from "@angular/http";

import {Eventos} from '../model/Eventos';
import {MediumModel} from '../model/MediumModel';
import {SpaceModel} from '../model/SpaceModel';
import {Select2OptionData} from "ng2-select2";
import {StructureService} from "../service/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilService} from "../service/util.service";
import {Modal, Overlay} from "angular2-modal";
import {CatalogService} from "../service/catalog.service";
import {MediosTableDTO} from "../model/helper/MediosTableDTO";

@Component ({
  selector: 'medios-admin',
  templateUrl: 'medios-admin.template.html',
  encapsulation: ViewEncapsulation.None,
})

export class MediosAdmin {
  // parametros de medios

  structureDataId : number = 0;
  versionNum : number = 0;
  //objeto del evento
  eventoData : Eventos = new Eventos();
  //objeto de la forma
  mediumModel : MediumModel = new MediumModel();
  //opciones de campos de fechas
  datepickerOpts : any = {};

  //tipoMedios
  private tipoMediosOptions : Select2OptionData[] = [];
  private tipoMediosMap : any = {};
  //zonas
  private zonasOptions : Select2OptionData[] = [];
  private zonasMap: any = {};

  //objeto de tabla
  //rows
  rows: Array<any> = [];
  //definicion de columnas
  columns: Array<any> = [
    {title: 'Listado de Medios', name: 'descripcion', sort: ''}
  ];
//valores parametros
  page: number = 1;
  itemsPerPage: number = 5;
  maxSize: number = 5;
  numPages: number = 2;
  length: number = 0;
  //configuracion
  config: any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: '', columnName: 'descripcion'}
  };
  //otro
  ng2TableData: Array<any> = mediosData;


  //identificador del medio seleccionado
  medioSeleccionado : number = 0;
  respaldo : MediumModel = new MediumModel();

  //informacion de mi tabla de medios manual
  mediosTable : MediosTableDTO = new MediosTableDTO();
  settings = {
    columns: {
      id: {
        title: 'ID'
      },
      albumId: {
        title: 'Album'
      },
      title: {
        title: 'Title'
      },
      url: {
        title: 'Url'
      }
    }
  };

  source: ServerDataSource;

  constructor(http: Http,
              private route: ActivatedRoute,
              private utilService : UtilService,
              private structureService : StructureService,
              private catalogService : CatalogService,
              //overlay: Overlay,
              vcRef: ViewContainerRef,
              // public modal: Modal,
              private router: Router
  ) {

    this.source = new ServerDataSource(http, { endPoint: 'https://jsonplaceholder.typicode.com/photos' });

  }

  ngOnInit(): void {
    //this.utilService.loadDateFormat(jQuery);

    jQuery('.select2').select2();

    //carga de parametros de entrada
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    //this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    //carga de información del evento
    this.loadEvento(this.structureDataId);
    this.loadCombos();
    //this.reconstruirNombreDeMedio();
  }

  /*Carga del evento*/
  loadEvento(structureDataId : number){
    console.info("structureDataId= "+structureDataId);
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;

        //this.mediumModel.fechaInicial = new Date(this.eventoData.fechaInicialTime);
        //this.mediumModel.fechaFinal = new Date(this.eventoData.fechaFinalTime);
        //this.datepickerOpts= this.utilService.loadDateOptions(this.mediumModel.fechaInicial, this.mediumModel.fechaFinal);
        //this.loadMediosDeEvento(this.eventoData.eventosId);
        this.loadMediosDeEvento2(this.eventoData.eventosId, false);
      });
  }

  /*carga de medios por evento*/
  loadMediosDeEvento2(eventoId, last){
    console.info("eventoId= "+eventoId);
    console.info("last= "+last);
    let cLast = last || false;
    this.structureService.getMediosByEventoIdAndPagination(eventoId, this.mediosTable).then(data=>{
      this.mediosTable.buildFromData(data);
      if(cLast){
        this.moveMedioTableToPage(this.mediosTable.data.totalPages-1);
      }
    });
  }

  public moveMedioTableToPage(e){
    this.mediosTable.page = e;
    this.loadMediosDeEvento2(this.eventoData.eventosId, false);
  }

  searchMedios(event:any){
    let text = event.target.value;
    console.info("TEXT= "+text);
    if(text.length > 0){
      this.findMediosDeEventoByDescription(this.eventoData.eventosId, text);
    }else{
      this.loadMediosDeEvento2(this.eventoData.eventosId, false);
    }
  }

  /*busqueda de medios de evento por nombre*/
  findMediosDeEventoByDescription(eventoId, text){
    this.mediosTable.page = 0;
    this.structureService.findMediosByEventoIdAndNameAndPagination(eventoId, text, this.mediosTable).then(data=>{
      this.mediosTable.buildFromData(data);
    });
  }

  /*reconstruir nombre de medio*/
/*  reconstruirNombreDeMedio(){

    let tipoMedio = '';
    if(this.tipoMediosMap && this.mediumModel.tipoMediosId){
      tipoMedio = this.tipoMediosMap[this.mediumModel.tipoMediosId].text;
    }
    let zona = '';
    if(this.zonasMap && this.mediumModel.zonasId ){
      zona = this.zonasMap[this.mediumModel.zonasId].text;
    }

    let fechaIni = this.obtenerCodigoDeFecha(this.mediumModel.fechaInicial);
    let fechaFin = this.obtenerCodigoDeFecha(this.mediumModel.fechaFinal);
    let r = `${tipoMedio} ${zona} ${fechaIni}-${fechaFin}`;
    this.mediumModel.nombreHerramienta = r;
  }*/

/*  obtenerCodigoDeFecha(date : Date){
    if(date){
      let days = ['D','L','M','M','J','V','S'];
      let months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
      let day = days[ date.getDay() ];
      let month = months[ date.getMonth() ];
      let number = date.getUTCDate().toString();
      return day+month+(number.length == 1 ? '0'+number : number);
    }else{
      return '';
    }
  }*/

  /*Carga inicial de catalogos*/
  loadCombos(){
    this.catalogService.getTipoMedios().then(data => {
      this.tipoMediosOptions = data;
      this.mediumModel.tipoMediosId = parseInt(this.tipoMediosOptions[0].id);
      this.tipoMediosMap = this.utilService.getMapFromArray(data, 'tipoMediosId');
    });

   /* this.catalogService.getZonas().then(data => {
      this.zonasOptions = data;
      this.mediumModel.zonasId = parseInt(this.zonasOptions[0].id);
      this.zonasMap = this.utilService.getMapFromArray(data, 'zonasId');
    });*/

   /* this.catalogService.getCategorias().then(data => {
      this.categoriasOptions = data;
      this.mediumModel.categoriasId = parseInt(this.categoriasOptions[0].id);
      this.categoriasMap = this.utilService.getMapFromArray(data, 'categoriasId');
    });

    this.catalogService.getSubCategorias().then(data => {
      this.subCategoriasOptions = data;
      this.mediumModel.subCategoriasId = parseInt(this.subCategoriasOptions[0].id);
      this.subCategoriasMap = this.utilService.getMapFromArray(data, 'subCategoriasId');
    });
    */
  }

  /*settings = {
    columns: {
      id: {
        title: 'ID'
      },
      name: {
        title: 'Full Name'
      },
      username: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    }
  };

  data = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz"
    },
    // ... other rows here
    {
      id: 11,
      name: "Nicholas DuBuque",
      username: "Nicholas.Stanton",
      email: "Rey.Padberg@rosamond.biz"
    }
  ];*/

}

