import { Component, ViewEncapsulation, AfterViewInit,ViewContainerRef  } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { tableData, mediosData } from './table.data';

import { Router, ActivatedRoute} from '@angular/router';

import {StructureService} from '../../service/structure.service';
import {UtilService} from '../../service/util.service';
import {CatalogService} from '../../service/catalog.service';

import {Eventos} from '../../model/Eventos';
import {MediumModel} from '../../model/MediumModel';
import {SpaceModel} from '../../model/SpaceModel';
import {MediumTableModel} from '../../model/MediumTableModel';

import {MediosRequestDTO} from '../../model/dto/MediosRequestDTO';
import {EspaciosRequestDTO} from '../../model/dto/EspaciosRequestDTO';

import {MediosTableDTO} from '../../model/helper/MediosTableDTO';
import {EspaciosTableDTO} from '../../model/helper/EspaciosTableDTO';

import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import * as data from './medios.data';

declare var jQuery: any;

@Component({
  selector: '[forms-wizard]',
  templateUrl: './medios.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./medios.style.scss']
})

export class Medios {

  /*requeridos por select*/
  selected: any;
  select2Options: any = {
    theme: 'bootstrap',
  };
  select2OptionsDisabled: any = {
    theme: 'bootstrap',
    disabled : true
  };

  /*tabla*/

  destindationMask = {
    mask: [/[1-9]/, /\d/, /\d/, /\d/, /\d/]
  };

  creditMask = {
    mask: [/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  };

  destinationValue = '';
  creditValue = '';

  unmask(event) {
    return event.replace(/\D+/g, '');
  }

  /*----------------------------------------------------------------------------------------------------*/
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

  //paginas
  private paginasOptions : Select2OptionData[] = [];
  private paginasMap : any = {};

  //espacios
  private espaciosOptions : Select2OptionData[] = [];
  private espaciosMap : any = {};

  //categorias
  private categoriasOptions : Select2OptionData[] = [];
  private categoriasMap: any = {};

  //subcategorias
  private subCategoriasOptions : Select2OptionData[] = [];
  private subCategoriasMap: any = {};


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
  //informacion de mi tabla de espacios manual
  espaciosTable : EspaciosTableDTO = new EspaciosTableDTO();

  /*----------------------------------------------------------------------------------------------------*/

  constructor(
    private route: ActivatedRoute,
    private structureService : StructureService,
    private utilService : UtilService,
    private catalogService : CatalogService,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
    private router: Router) {

      overlay.defaultViewContainer = vcRef;
      this.length = this.ng2TableData.length;
  }

  ngOnInit(): void {
    this.utilService.loadDateFormat(jQuery);

    jQuery('.select2').select2();

    //carga de parametros de entrada
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    //carga de información del evento
    this.loadEvento(this.structureDataId);
    this.loadCombos();
    this.reconstruirNombreDeMedio();
  }

  ngAfterViewInit() {
    jQuery( document ).ready(function() {
      jQuery('.timepicker').hide();
      jQuery('.pagination-first').hide();
      jQuery('.pagination-last').hide();
      jQuery('.pagination-prev a').html('<i class="fa fa-caret-left"></i>');
      jQuery('.pagination-next a').html('<i class="fa fa-caret-right"></i>');
    });
    this.reconstruirNombreDeMedio();
  }

  /*-----------------------------------------------------------------------------------------------------*/
  /*Carga del evento*/
  loadEvento(structureDataId : number){
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;

        this.mediumModel.fechaInicial = new Date(this.eventoData.fechaInicialTime);
        this.mediumModel.fechaFinal = new Date(this.eventoData.fechaFinalTime);
        this.datepickerOpts= this.utilService.loadDateOptions(this.mediumModel.fechaInicial, this.mediumModel.fechaFinal);
        //this.loadMediosDeEvento(this.eventoData.eventosId);
        this.loadMediosDeEvento2(this.eventoData.eventosId, false);
      });
  }

  /*carga de medios por evento*/
  loadMediosDeEvento2(eventoId, last){
    let cLast = last || false;
    this.structureService.getMediosByEventoIdAndPagination(eventoId, this.mediosTable).then(data=>{
      this.mediosTable.buildFromData(data);
      if(cLast){
        this.moveMedioTableToPage(this.mediosTable.data.totalPages-1);
      }
    });
  }

  /*busqueda de medios de evento por nombre*/
  findMediosDeEventoByDescription(eventoId, text){
    this.mediosTable.page = 0;
    this.structureService.findMediosByEventoIdAndNameAndPagination(eventoId, text, this.mediosTable).then(data=>{
      this.mediosTable.buildFromData(data);
    });
  }

  /*carga de medios por evento*/
  loadMediosDeEvento(eventoId){
    this.structureService.getMediosByEventoId(eventoId).then(data=>{
      this.ng2TableData = data;
      //carga de tabla
      this.onChangeTable(this.config);
    });
  }

  /*Carga inicial de catalogos*/
  loadCombos(){
    this.catalogService.getTipoMedios().then(data => {
      this.tipoMediosOptions = data;
      this.mediumModel.tipoMediosId = parseInt(this.tipoMediosOptions[0].id);
      this.tipoMediosMap = this.utilService.getMapFromArray(data, 'tipoMediosId');
    });

    this.catalogService.getZonas().then(data => {
      this.zonasOptions = data;
      this.mediumModel.zonasId = parseInt(this.zonasOptions[0].id);
      this.zonasMap = this.utilService.getMapFromArray(data, 'zonasId');
    });

    this.catalogService.getCategorias().then(data => {
      this.categoriasOptions = data;
      this.mediumModel.categoriasId = parseInt(this.categoriasOptions[0].id);
      this.categoriasMap = this.utilService.getMapFromArray(data, 'categoriasId');
    });

    this.catalogService.getSubCategorias().then(data => {
      this.subCategoriasOptions = data;
      this.mediumModel.subCategoriasId = parseInt(this.subCategoriasOptions[0].id);
      this.subCategoriasMap = this.utilService.getMapFromArray(data, 'subCategoriasId');
    });

  }

  /*reconstruir nombre de medio*/
  reconstruirNombreDeMedio(){

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
  }

  obtenerCodigoDeFecha(date : Date){
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
  }

  /*Evento onChange tipoMedios*/
  tipoMediosChangeEvent(e: any): void {
      this.mediumModel.tipoMediosId = e.value;
      this.reconstruirNombreDeMedio();
      this.cargarPaginaYEspacio(this.mediumModel.tipoMediosId);
      this.limpiarEspacios();
  }

  cargarPaginaYEspacio(tipoMedio){
    this.catalogService.getTipoMediosById(tipoMedio).then(
        data => {

          let pagesTmpData : Select2OptionData[] = [];
          let spacesTmpData : Select2OptionData[] = [];

          //carga portada
          if(data.aplicaPortadaYContraportada){
            pagesTmpData.push({id: '0', text:'Portada'});
          }
          //genera el numero de paginas correspondiente
          if(data.numeroPaginas > 0){
            for(let i=0; i<data.numeroPaginas; i++){
              pagesTmpData.push({id:(i+1).toString(), text:('Página ' + (i+1))});
            }
          }
           //carga contraportada
          if(data.aplicaPortadaYContraportada){
            pagesTmpData.push({id:(data.numeroPaginas + 1),text:'Contraportada'});
          }

          this.paginasOptions = pagesTmpData;
          this.mediumModel.paginasId = parseInt(this.paginasOptions[0].id);
          this.paginasMap = this.utilService.getMapFromArray(this.paginasOptions, 'id');

          //genera combo de espacios en base al maximo
          if(data.maximoDeEspacios > 0){
            for(let i = 0; i < data.maximoDeEspacios; i++){
              spacesTmpData.push({id:(i+1).toString(), text:(i+1).toString()});
            }
          }

          this.espaciosOptions = spacesTmpData;
          this.mediumModel.espaciosId = parseInt(this.espaciosOptions[0].id);
          this.espaciosMap = this.utilService.getMapFromArray(this.espaciosOptions, 'id');

        }
      );
  }

  /* onChange paginas*/
  paginasChangeEvent(e: any): void {
    this.mediumModel.paginasId = parseInt(e.value);
  }

  /* onChange espacios*/
  espaciosChangeEvent(e: any): void{
    this.mediumModel.espaciosId = parseInt(e.value);
  }

  /* onChange categorias */
  categoriasChangeEvent(e: any): void{

    this.mediumModel.categoriasId = parseInt(e.value);
    this.catalogService.getSubCategoriasByCategoriasId(this.mediumModel.categoriasId).then(
      data => {
        let subCatTmpData : Select2OptionData[] = [];
        for(let sc of data){
          subCatTmpData.push({id: sc.subCategoriasId, text: sc.name});
        }
        this.subCategoriasOptions = subCatTmpData;
        this.mediumModel.subCategoriasId = parseInt(this.subCategoriasOptions[0].id);
        this.subCategoriasMap = this.utilService.getMapFromArray(data, 'subCategoriasId');
      }
    );


  }

  /* onChange subCategorias */
  subCategoriasChangeEvent(e: any): void{
    this.mediumModel.subCategoriasId = parseInt(e.value);
  }

  zonasChangeEvent(e: any): void {
    this.mediumModel.zonasId = e.value;
    this.reconstruirNombreDeMedio();
  }

  getRequestDTO(){
     let request : MediosRequestDTO = new MediosRequestDTO();
      request.tipoMediosId = this.mediumModel.tipoMediosId;
      request.tipoMediosStr = this.tipoMediosMap[request.tipoMediosId].text;
      request.zonasId = this.mediumModel.zonasId;
      request.zonasStr = this.zonasMap[request.zonasId].text;
      request.fechaInicial = this.mediumModel.fechaInicial;
      request.fechaInicialTime = this.mediumModel.fechaInicial.getTime();
      request.fechaFinal = this.mediumModel.fechaFinal;
      request.fechaFinalTime = this.mediumModel.fechaFinal.getTime();
      request.eventosId = this.eventoData.eventosId;
      if(this.mediumModel.nombreHerramienta && this.mediumModel.nombreHerramienta.length > 0){
        request.description = this.mediumModel.nombreHerramienta;
      }

      //logica de espacios
      if(this.mediumModel.espacios.length > 0){
        for(let s of this.mediumModel.espacios){
          let espacio:EspaciosRequestDTO = new EspaciosRequestDTO();
          espacio.paginasId = s.paginasId;
          espacio.espaciosId = s.espaciosId;
          espacio.categoriasId = s.categoriasId;
          espacio.subCategoriasId = s.subCategoriasId;
          request.espacios.push(espacio);
        }
      }
      return request;
  }

  public moveMedioTableToPage(e){
    this.mediosTable.page = e;
    this.loadMediosDeEvento2(this.eventoData.eventosId, false);
  }

  /*Evento para guardar medio*/
  saveMedios(){

    let request : MediosRequestDTO = this.getRequestDTO();
    //armar nombre de la herramienta (pantalla) si no se capturo
    if(this.mediumModel.nombreHerramienta == null || this.mediumModel.nombreHerramienta.length == 0){
      this.reconstruirNombreDeMedio();
    }

    //si se trata de actualizacion
    if(parseInt(this.mediumModel.numeroHerramienta) > 0){
      request.mediosId = this.mediumModel.mediosId;
      this.structureService.actualizarMedios(request.mediosId, request).subscribe(
        response => {
          if(response.status == 200 ){
            let nvo = JSON.parse(response['_body']);
            this.loadMediosDeEvento2(this.eventoData.eventosId, false);
            this.modal.alert().title('Medio Actualizado').body('Registro actualizado exitosamente').open();
          }
        },
        error => {
          this.modal.alert().title('Error al Crear Medio').body(error._body).open();
        }
      );
    //si se trata de un guardado nuevo
    }else{
      request.mediosId = null;
      this.structureService.guardarMedios(request).subscribe(
        response => {
          if(response.status == 201 ){
            let nvo = JSON.parse(response['_body']);
            this.loadMediosDeEvento2(this.eventoData.eventosId, true);
            this.modal.alert().title('Medio Guardado').body('Registro guardado exitosamente').open();
          }
        },
        error => {
          this.modal.alert().title('Error al Crear Medio').body(error._body).open();
        }
      );
    }
  }

  /*-----------------------------------------------------------------------------------------------------*/
  onChangeTable(config: any, page: any = {page: this.page, itemsPerPage: this.itemsPerPage}): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.ng2TableData, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    let filteredData: Array<any> = data.filter((item: any) =>
      item[config.filtering.columnName].toUpperCase().match(this.config.filtering.filterString.toUpperCase()));

    return filteredData;
  }
  changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }
  changePage(page: any, data: Array<any> = this.ng2TableData): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  copyMedioToForm(medio){
    if(this.existenCambiosNoGuardados()){
      if (confirm("Se detectaron cambios no guardados. Si continúa perderá dichos cambios. ¿Desea Continuar?")) {
        this.copy(medio);
      }
    }else{
      this.copy(medio);
    }
  }

  copy(medio){
      this.resetForm();
      this.mediumModel.tipoMediosId = medio.tipoMediosId;
      this.mediumModel.zonasId = medio.zones[0].zonasId;
      this.mediumModel.fechaInicial = new Date(medio.fechaInicial);
      this.mediumModel.fechaFinal = new Date(medio.fechaFinal);
      this.mediumModel.nombreHerramienta = medio.descripcion;
      jQuery("#tipoMedio select").val(this.mediumModel.tipoMediosId).trigger('change');
      jQuery("#zona select").val(this.mediumModel.zonasId).trigger('change');
      this.mediumModel.espacios = medio.espacios;
      this.mediumModel.espaciosKeys = medio.espaciosKeys;

      /*espacios*/
      let spaces : SpaceModel[] = [];
      for(let e  of medio.espacios){
        let space : SpaceModel = new SpaceModel();
        space.paginasId = e.numeroParte;
        space.espaciosId = e.numeroSeccion;
        space.categoriasId = e.categoriasId;
        space.subCategoriasId = e.subCategoriasId;
        space = this.loadSpacesModel(space);
        spaces.push(space);
      }

      this.mediumModel.espacios = spaces;
      this.mediumModel.rebuildSpacesKeys();
      this.respaldo.copyFromBase(this.mediumModel);
  }

  /*Seleccion de un elemento de una tabla*/
   onCellClick(data: any, event : any): any {
    let r = data;
    if(this.existenCambiosNoGuardados()){
      if (confirm("Se detectaron cambios no guardados. Si continúa perderá dichos cambios. ¿Desea Continuar?")) {
        this.medioRowSelect(r);
      }
    }else{
      this.medioRowSelect(r);
    }
    let ndata = this.buildEspaciosPaginationData(0, this.espaciosTable.size);
    this.espaciosTable.buildFromData(ndata);

  }

  medioRowSelect(r){
    if(this.medioSeleccionado == 0 || (this.medioSeleccionado > 0 && this.medioSeleccionado != r.mediosId)){
      this.medioSeleccionado = r.mediosId;
      this.mediumModel.mediosId = r.mediosId;
      this.mediumModel.numeroHerramienta = r.mediosId;
      this.mediumModel.tipoMediosId = r.tipoMediosId;
      this.mediumModel.zonasId = r.zones[0].zonasId;
      this.mediumModel.fechaInicial = new Date(r.fechaInicial);
      this.mediumModel.fechaFinal = new Date(r.fechaFinal);
      this.mediumModel.nombreHerramienta = r.descripcion;
      jQuery("#tipoMedio select").val(this.mediumModel.tipoMediosId).trigger('change');
      jQuery("#zona select").val(this.mediumModel.zonasId).trigger('change');

      let spaces : SpaceModel[] = [];
      for(let e  of r.espacios){
        let space : SpaceModel = new SpaceModel();
        space.paginasId = e.numeroParte;
        space.espaciosId = e.numeroSeccion;
        space.categoriasId = e.categoriasId;
        space.subCategoriasId = e.subCategoriasId;
        space = this.loadSpacesModel(space);
        spaces.push(space);
      }
      this.mediumModel.espacios = spaces;
      this.mediumModel.rebuildSpacesKeys();
      this.respaldo.copyFromBase(this.mediumModel);
    }else{
      this.resetForm();
    }
  }

  resetForm(){
      this.medioSeleccionado = 0;
      this.mediumModel.mediosId = 0;
      this.mediumModel.numeroHerramienta = null;
      this.mediumModel.nombreHerramienta = null;
      this.respaldo = new MediumModel();
      this.mediumModel.espacios = [];
      this.mediumModel.espaciosKeys = [];
  }

  existenCambiosNoGuardados(){
    if(this.medioSeleccionado <= 0){
      return false;
    }
    if(this.respaldo.tipoMediosId != this.mediumModel.tipoMediosId ||
      this.respaldo.zonasId != this.mediumModel.zonasId ||
      this.respaldo.fechaInicial != this.mediumModel.fechaInicial ||
      this.respaldo.fechaFinal != this.mediumModel.fechaFinal ||
      this.respaldo.nombreHerramienta != this.mediumModel.nombreHerramienta ||
      this.espaciosDiferentes()
    ){
      return true;
    }else{
      return false;
    }
  }
  espaciosDiferentes(){
    let respaldo = JSON.stringify(this.respaldo.espacios);
    let current = JSON.stringify(this.mediumModel.espacios);
    let respaldok = JSON.stringify(this.respaldo.espaciosKeys);
    let currentk = JSON.stringify(this.mediumModel.espaciosKeys);
    let equals = false;
    if(respaldo != current){
      equals = true;
    }if(respaldok != currentk){
      equals = true;
    }
    return equals;
  }

  cancel(){
    if(this.existenCambiosNoGuardados()){

      if (confirm("Se detectaron cambios no guardados. Si continúa perderá dichos cambios. ¿Desea Continuar?")) {
        this.router.navigateByUrl('app');
      }
    }else{
      this.router.navigateByUrl('app');
    }
  }

  delete(){
    if(this.medioSeleccionado <= 0){
       this.modal.alert().title('Seleccione un medio').body('Seleccione un medio para ejecutar la acción de borrado.').open();
    }else{
      if(confirm("Se eliminará el medio seleccionado. Esta acción no se puede revertir. ¿Desea Continuar?")){
        this.structureService.borrarMedios(this.medioSeleccionado).subscribe(
        response => {
          if(response.status == 200 ){
            //this.mediumModel.numeroHerramienta = nvo.mediosId;
            //this.mediumModel.nombreHerramienta = nvo.descripcion;
            this.mediosTable.page = 0;
            this.loadMediosDeEvento2(this.eventoData.eventosId, false);
            this.modal.alert().title('Medio Eliminado').body('Registro eliminado exitosamente').open();
            this.mediumModel.mediosId = 0;
            this.mediumModel.numeroHerramienta = '';
            this.mediumModel.nombreHerramienta = '';
            this.respaldo = new MediumModel();
            this.medioSeleccionado = 0;

            this.limpiarEspacios();
          }
        },
        error => {
          this.modal.alert().title('Error al Eliminar Medio').body(error._body).open();
        }
      );
      }
    }
  }



















  /*select*/
  select2Changed(e: any): void {
    this.selected = e.value;
  }
  getSelect2DefaultList(): Select2OptionData[] {
    return data.select2DefaultData;
  }
  getZonasDefaultList(): Select2OptionData[] {
    return data.zonasDefaultData;
  }
  getPaginasDefaultList(): Select2OptionData[] {
    return data.paginasDefaultData;
  }
  getEspacioDefaultList(): Select2OptionData[] {
    return data.espacioDefaultData;
  }
  getCategoriasDefaultList(): Select2OptionData[] {
    return data.categoriaDefaultData;
  }
  getSubCategoriasDefaultList(): Select2OptionData[]{
    return data.subCategoriaDefaultData;
  }

  initialDateChange(){
    if(this.mediumModel.fechaInicial > this.mediumModel.fechaFinal){
      this.mediumModel.fechaFinal = new Date(this.mediumModel.fechaInicial);
    }
    this.reconstruirNombreDeMedio();
  }
  finalDateChange(){
    if(this.mediumModel.fechaFinal < this.mediumModel.fechaInicial){
      this.mediumModel.fechaInicial = new Date(this.mediumModel.fechaFinal);
    }
    this.reconstruirNombreDeMedio();
  }

  searchMedios(event:any){
    let text = event.target.value;
    if(text.length > 0){
      this.findMediosDeEventoByDescription(this.eventoData.eventosId, text);
    }else{
      this.loadMediosDeEvento2(this.eventoData.eventosId, false);
    }
  }
  testSelect(medios){
    alert("medio seleccionado: " + medios.mediosId);
  }


  medioKeyUpEvent(event: KeyboardEvent){
    var temp: RegExpMatchArray = this.mediumModel.nombreHerramienta.match('[a-zA-Z 0-9]*');
    if (temp[0].length < this.mediumModel.nombreHerramienta.length){
     // jQuery('#eventoName').popover('show');
      this.mediumModel.nombreHerramienta = this.mediumModel.nombreHerramienta.slice(0, -1);
    }
  }

  /*--------------------------------------------------------------------------------*/
  //funciones de pagina dos

  //agregar espacios a la segunda tabla
  agregarEspacio(){

    let tmpSpaces : SpaceModel[] = [];
    let currentSpace = this.mediumModel.getSpaceModelFromForm();

    //si ya existen combinacion de pagina cat y subcat
    if(this.mediumModel.existsCurrentSpaceOnKeys(currentSpace)){
      this.mediumModel.dropSpace(currentSpace);
    //si no estan, agrego la llave
    }else{
      this.mediumModel.addSpaceKey(currentSpace);
    }

    //carga de detalle
    for(let i = 0; i < currentSpace.espaciosId; i++){
      let currentSpace : SpaceModel = this.mediumModel.getSpaceModel(i+1);
      this.loadSpacesModel(currentSpace);
      tmpSpaces.push(currentSpace);
    }
    this.mediumModel.espacios = this.mediumModel.espacios.concat(tmpSpaces);
    this.mediumModel.resortPerPage();

    //se reconstruye la paginacion
    let ndata = this.buildEspaciosPaginationData(0, this.espaciosTable.size);
    this.espaciosTable.buildFromData(ndata);
    this.moveEspaciosTableToPage(ndata.totalPages -1);
  }

  loadSpacesModel(space:SpaceModel):SpaceModel{
    space.paginas = this.paginasMap[space.paginasId];
    space.espacios = this.espaciosMap[space.espaciosId];
    space.categorias = this.categoriasMap[space.categoriasId];
    if(this.subCategoriasMap[space.subCategoriasId] == undefined){

      this.catalogService.getSubCategoriasByCategoriasIdSubscribe(space.categoriasId).subscribe(
        response => {
          let nvo = JSON.parse(response['_body']);
          let scm = this.utilService.getMapFromArray(nvo, 'subCategoriasId');
          space.subCategorias = scm[space.subCategoriasId];
        },
        error => {
          console.log("Error");
        }
      );
    }else{
      space.subCategorias = this.subCategoriasMap[space.subCategoriasId];
    }

    return space;
  }

  //funcion para agregar espacios
  searchEspacios(event:any){
  }

  borrarEspaciosDeGridDos(espacio:SpaceModel){
    this.mediumModel.borrarEspacio(espacio);
    //reconstruir la paginacion
    let ndata = this.buildEspaciosPaginationData(0, this.espaciosTable.size);
    this.espaciosTable.buildFromData(ndata);
    this.moveEspaciosTableToPage(ndata.totalPages -1);
  }

  //funcion para borrar un espacio del grid
  borrarEspacioDeGrid(espacio:SpaceModel){
    let currentSpaces = this.mediumModel.getCurrentSpacesByPage(espacio);
    this.mediumModel.dropSpaceByPage(espacio);
    let t = currentSpaces - 1;
     let tmpSpaces : SpaceModel[] = [];
    //carga de detalle
    if(t > 0){
      for(let i = 0; i < t; i++){
        let currentSpace : SpaceModel = new SpaceModel();
        currentSpace.copyKey(espacio);
        currentSpace.setEspaciosId(i+1);
        this.loadSpacesModel(currentSpace);
        tmpSpaces.push(currentSpace);
      }
    }
    this.mediumModel.espacios = this.mediumModel.espacios.concat(tmpSpaces);
  }

  //funcion para limpiar la tabla
  limpiarEspacios(){
    this.mediumModel.limpiarEspacios();
    //se reconstruye la paginacion
    let ndata = this.buildEspaciosPaginationData(0, this.espaciosTable.size);
    this.espaciosTable.buildFromData(ndata);
    this.moveEspaciosTableToPage(ndata.totalPages -1);
  }

  /*
    funciones de tabla de espacios
  */
  public moveEspaciosTableToPage(e){
    this.espaciosTable.page = e;
    let data = this.buildEspaciosPaginationData(e, this.espaciosTable.size);
    this.espaciosTable.buildFromData(data);
  }

  public buildEspaciosPaginationData(page:number, size: number){

    let dataElement : any = {};
    let totalElementos = this.mediumModel.espacios.length;
    let totalPaginas = parseInt((totalElementos / size).toString());
    let module = totalElementos % size;

    if ((totalElementos % size) > 0){
      totalPaginas = totalPaginas + 1;
    }

    let inicialIndice = page * size;
    let finalIndice = inicialIndice + size;

    if(finalIndice > this.mediumModel.espacios.length){
      finalIndice = this.mediumModel.espacios.length;
    }
    let p = totalPaginas - 1;
    let isLast = (page == p);
    let orig = this.mediumModel.espacios;
    let content = orig.slice(inicialIndice, finalIndice);
    dataElement['content'] = content;
    dataElement['last'] = isLast;
    dataElement['totalElements'] = this.mediumModel.espacios.length;
    dataElement['totalPages'] = totalPaginas;
    dataElement['size'] = size;
    dataElement['number'] = page;
    dataElement['numberOfElements'] = content.length;
    dataElement['first'] = (page == 0);
    return dataElement;
  }

  finalizarCaptura(){

    if(this.existenCambiosNoGuardados()){
      if (confirm("Se detectaron cambios no guardados. Si continúa perderá dichos cambios. ¿Desea Continuar?")) {
        let requestData : any = {};
        requestData.dataId = this.structureDataId;
        requestData.versionNum = this.versionNum;
        requestData.valueCode = "SIGUIENTE";
        requestData.eventosId = this.eventoData.eventosId;

        this.structureService.saveMedium(requestData).then(
          response => {
            if(response.status == 200 ){
              this.router.navigateByUrl('app');
            }else{
              this.modal.alert().title('Error al finalizar captura').body(JSON.stringify(response)).open();
            }
          },
          error =>{
              console.log(error._body);
              this.modal.alert().title('Error al finalizar captura').body(error._body).open();
          }
        );
      }
    }else{
      let requestData : any = {};
        requestData.dataId = this.structureDataId;
        requestData.versionNum = this.versionNum;
        requestData.valueCode = "SIGUIENTE";
        requestData.eventosId = this.eventoData.eventosId;

        this.structureService.saveMedium(requestData).then(
          response => {
            if(response.status == 200 ){
              this.router.navigateByUrl('app');
            }else{
              this.modal.alert().title('Error al finalizar captura').body(JSON.stringify(response)).open();
            }
          },
          error =>{
              this.modal.alert().title('Error al finalizar captura').body(error._body).open();
          }
        );
    }
  }

}
