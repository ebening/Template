import { Component, 
  ViewEncapsulation, 
  AfterViewInit, 
  ViewContainerRef,
  trigger,  
  state,
  style,
  transition,
  animate  } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

import { Router, ActivatedRoute} from '@angular/router';

import {StructureService} from '../../service/structure.service';
import {UtilService} from '../../service/util.service';
import {CatalogService} from '../../service/catalog.service';

import {Eventos} from '../../model/Eventos';
import {MediumModel} from '../../model/MediumModel';
import {SpaceModel} from '../../model/SpaceModel';
import {MediumTableModel} from '../../model/MediumTableModel';

import {ExcelErrorDTO} from '../../model/dto/ExcelErrorDTO';
import {ExcelRowDTO} from '../../model/dto/ExcelRowDTO';

import {OfertasModel} from '../../model/Ofertas';

import {Base} from '../base/base.component';
import {IBase} from '../base/ibase';
      
import {MediosRequestDTO} from '../../model/dto/MediosRequestDTO';
import {EspaciosRequestDTO} from '../../model/dto/EspaciosRequestDTO';

import {MediosTableDTO} from '../../model/helper/MediosTableDTO';
import {EspaciosTableDTO} from '../../model/helper/EspaciosTableDTO';

import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import {FileUploader} from "ng2-file-upload";

declare var jQuery: any;
declare let XLSX: any;

@Component({
  selector: '[forms-wizard]',
  templateUrl: './ofertas.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ofertas.style.scss'],
  animations: [
    
    trigger('animaciontest', [ 
      state('inactive', style({transform: 'translateX(0) scale(0)', display:'none'})),
      state('active',   style({transform: 'translateX(0) scale(1)'})),
      transition('inactive => active', animate('200ms linear')),
      transition('active => inactive', animate('200ms linear'))
    ])
  ]
})

export class Ofertas extends Base {

   /*requeridos por select*/
  selected: any;
  select2Options: any = {
    theme: 'bootstrap',
  };
  select2OptionsDisabled: any = {
    theme: 'bootstrap',
    disabled : true
  };
  select2OptionsMultiple: any = {
    theme: 'bootstrap',
    multiple: true
  };

  /*----------------------------------------------------------------------------------------------------*/
  structureDataId : number = 0;
  versionNum : number = 0;
  eventoData : Eventos = new Eventos();

  //informacion de la configuracion de la vista
  viewTitle : string = "";
  viewContent : any = {};

  viewActions : any[] = [];
  actionsMap : any = {};

  applyExcelExport : number = 0;
  
  excelValidations : any[] = [];
  excelValidationsMap : any = {};

  excelConfig : any[] = [];
  excelConfigMap : any[] = [];

  //campos de grids dinamicos
  grids : any[] = [];
  gridsMap : any = {};

  testspan = 18;

  //variable de carga de archivos
  private uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/'});
  private options = {readAs: 'BinaryString'};
  private hasBaseDropZoneOver: boolean = false;
  
  private fileIsOver : boolean;
  private fileLoaderMsg : string = 'Arrastre y suelte archivos desde el escritorio directamente a este di??logo para subirlos aqu??.';
  private fileOk : boolean;

  //x
  private comboOptions : Select2OptionData[] = [];
  private comboMap : any = {};

  //banderas para controlar estatus de pantalla
  private seeCombo : boolean = false;
  private seeForm : boolean = false;

  //modelo del formulario
  private form : OfertasModel = new OfertasModel();

  //descripcion Combo
  private descripcionesComboOptions : Select2OptionData[] = [];
  private descripcionesComboMap: any = {};

  //descripcion Combo
  private descripcionesPromocionOptions : Select2OptionData[] = [];
  private descripcionesPromocionMap: any = {};


  //categorias
  private categoriasOptions : Select2OptionData[] = [];
  private categoriasMap: any = {};

  //subcategorias
  private subCategoriasOptions : Select2OptionData[] = [];
  private subCategoriasMap: any = {};

  //marca
  private marcasOptions : Select2OptionData[] = [];
  private marcasMap: any = {};

  //modelos
  private modelosOptions : Select2OptionData[] = [];
  private modelosMap: any = {};

  //presentaciones
  private presentacionesOptions : Select2OptionData[] = [];
  private presentacionesMap: any = {};

  //productos
  private productosOptions : Select2OptionData[] = [];
  private productosMap: any = {};


  //configuracion de campos de la vista
  viewConfig : any = [];
  fieldsMap : any = {};

  /*----------------------------------------------------------------------------------------------------*/
  constructor(
    router: Router,
    structureService : StructureService,
    private catalogService : CatalogService,
    private utilService : UtilService,
    private route: ActivatedRoute,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    super(structureService, router);
    
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit(): void {
    jQuery('.select2').select2();
    //carga de parametros de entrada
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    this.loadEvento(this.structureDataId);
    this.getView();

    this.buildBase(this.structureDataId, this.versionNum, this.eventoData);
    this.loadCombos();
  }
  ngAfterViewInit() {
    let self = this;
    jQuery( document ).ready(function() {
      if(self.form.numeroCombo < 1){
          jQuery("#oferta_number_descripcionCombo").prop("disabled", true);
      }
    });
  }

  loadCombos(){

    //cargando descripciones de loadCombos
    this.catalogService.getCombos().then(data => {
      this.descripcionesComboOptions = data;
      this.form.descripcionComboId = parseInt(this.descripcionesComboOptions[0].id);
      this.descripcionesComboMap = this.utilService.getMapFromArray(data, 'combosId');
    });

    //cargando descripciones de promocion
    this.catalogService.getPromociones().then(data => {
      this.descripcionesPromocionOptions = data;
      this.form.descripcionPromocionId = parseInt(this.descripcionesPromocionOptions[0].id);
      this.descripcionesPromocionMap = this.utilService.getMapFromArray(data, 'mecanicasId');
    });

    this.catalogService.getCategorias().then(data => {
      this.categoriasOptions = data;
      this.form.categoriaId = parseInt(this.categoriasOptions[0].id);
      this.categoriasMap = this.utilService.getMapFromArray(data, 'categoriasId');
    });

    this.catalogService.getSubCategorias().then(data => {
      this.subCategoriasOptions = data;
      this.form.subCategoriaId = parseInt(this.subCategoriasOptions[0].id);
      this.subCategoriasMap = this.utilService.getMapFromArray(data, 'subCategoriasId');
    });

    //marcas
    this.catalogService.getMarcas().then(data => {
      this.marcasOptions = data;
      this.form.marcaId = parseInt(this.marcasOptions[0].id);
      this.marcasMap = this.utilService.getMapFromArray(data, 'marcasId');
    });

    //modelos
    this.catalogService.getModelos().then(data => {
      this.modelosOptions = data;
      this.form.modeloId = parseInt(this.modelosOptions[0].id);
      this.modelosMap = this.utilService.getMapFromArray(data, 'modelosId');
    });
    
    //presentaciones
    this.catalogService.getPresentaciones().then(data => {
      this.presentacionesOptions = data;
      this.form.presentacionId = parseInt(this.presentacionesOptions[0].id);
      this.presentacionesMap = this.utilService.getMapFromArray(data, 'presentacionesId');
    });

    //productos
    this.catalogService.getProductos().then(data => {
      this.productosOptions = data;
      //this.form.presentacionId = parseInt(this.presentacionesOptions[0].id);
      this.presentacionesMap = this.utilService.getMapFromArray(data, 'productosId');
    });



  }

  //funcion para cargar la configuracion de la pantalla
  getView() {
    this.structureService.getViewByAppId(1, this.versionNum).then(
      data => {
        this.viewContent = data;
        console.log(data);

        //carga de configuracion de formularios
        this.viewConfig = data.viewConfig || [];
        //armado de mapa a partir de campos
        var result = this.viewConfig.reduce(function (map, obj) {
          map[obj.htmlId] = obj;
          return map;
        }, {});
        //asignado a variable de instancia
        this.fieldsMap = result;
        console.log(this.fieldsMap);


        this.viewActions = data.viewAction || [];
        
        //armado de mapa de acciones
        let actionsResult = this.viewActions.reduce(function (map, obj) {
          map[obj.htmlId] = obj;
          return map;
        }, {});
        this.actionsMap = actionsResult;

        //asignacion de titulo
        this.viewTitle = this.viewContent.viewTitle;
        
        //si aplica export de excel
        if(this.viewContent.applyExcelImport != null && this.viewContent.applyExcelImport){
          this.excelValidations = data.viewExcelValidations;
          this.excelConfig = data.viewExcelConfig;
          
          //armado de mapa de validaciones
          let validations = this.excelValidations.reduce(function (map, obj) {
            map[obj.cell] = obj;
            return map;
          }, {});
          this.excelValidationsMap = validations;

          //armado de mapa de configuraciones
          let configs = this.excelConfig.reduce(function (map, obj) {
            map[obj.cell] = obj;
            return map;
          }, {});
          this.excelConfigMap = configs;
        }

        //si pantalla tiene grids dinamicos
        if(this.viewContent.viewGrids != null && this.viewContent.viewGrids && this.viewContent.viewGrids.length > 0){
          this.grids = this.viewContent.viewGrids;
          //armado de mapa de validaciones
          let gmap = this.grids.reduce(function (map, obj) {
            map[obj.htmlId] = obj;
            return map;
          }, {});
          this.gridsMap = gmap;
        }

      }
    );
  }

  existsDynamicTable(gridId: string):number{
    let res= 0;
    if(this.gridsMap.hasOwnProperty(gridId)){
      res = 1;
    }else{
      res = 0;
    }
    return res;
  }

  getTotalColumns(gridId:string):number{
    let totales=  this.gridsMap[gridId].viewGrids.length;
    return totales;
  }

  alsuperFinish(){
    alert("terminando de metodo custom alsuper");
  }

  loadEvento(structureDataId : number){
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;
      });
  }

  //funcion para regresar a bandeja
  cancel(){
     this.router.navigateByUrl('app');
  }

  //funcion para finalizar captura
  finalizarCaptura(){
    let requestData : any = {};
    requestData.dataId = this.structureDataId;
    requestData.versionNum = this.versionNum;
    requestData.valueCode = "SIGUIENTE";
    requestData.eventosId = this.eventoData.eventosId;

    this.structureService.saveOffer(requestData).then(
      response => {
        if(response.status == 200 ){
          this.router.navigateByUrl('app');
        }
      },
      error =>{
          this.modal.alert().title('Error al finalizar captura').body(error._body).open();
      }
    );
  }

  //funcion para regresar de etapa
  regresarEtapa(){
    let requestData : any = {};
    requestData.dataId = this.structureDataId;
    requestData.versionNum = this.versionNum;
    requestData.valueCode = "REGRESAR";
    requestData.eventosId = this.eventoData.eventosId;

    this.structureService.saveOffer(requestData).then(
      response => {
        if(response.status == 200 ){
          this.router.navigateByUrl('app');
        }
      },
      error =>{
          this.modal.alert().title('Error al finalizar captura').body(error._body).open();
      }
    );
  }

  onFileDrop(file: File): void {
    var hasRowsError: boolean = false;
    var alertMjs: string = '';
    try {
        //se obtiene el libro
        var workbook = XLSX.read(file, {type: 'binary', encoding: 'utf8'});
        //se obtienen las pesta??as
        var sheets: string[] = workbook.SheetNames;

        console.log("-----------------------------------------------------------------------------");
        console.log("pesta??as: ");
        console.log(sheets);
        console.log("-----------------------------------------------------------------------------");
        
        //se obtiene el nombre de la primer pesta??a
        let sheet = sheets[0];

        let isFileOk : boolean = true;
        //por cada validacion, configurada, se saca el archivo y se cotejan los datos:
        for(let validation of this.excelValidations){
          let options : string [] = validation.posibleValues.split(",");
          let cellObject = workbook.Sheets[sheet][validation.cell];
          if(cellObject === undefined){
            isFileOk = false;
          }else{
            let cellValue : string = (workbook.Sheets[sheet][validation.cell]).v;
            if(options.indexOf(cellValue) == -1){
              isFileOk = false;
              break;
            }
          }
        }
       
        console.log("-----------------------------------------------------------------------------");


        this.fileOk = isFileOk;
        if(!isFileOk){
          this.modal.alert().title('Error al importar desde Excel').body('El archivo cargado no cuenta con el formato configurado en la herramienta. Verifique.').open();
        }else{
          
          let datos : ExcelRowDTO[] = [];

          //for cada pesta??a
          for(let nombrePesta??a of sheets){
            let pesta??a = workbook.Sheets[nombrePesta??a];
            let filaInicial = this.viewContent['excelDataFirstRow'];
            let filaFinal = this.getFinalRow(pesta??a);
              
            //iteracion por cada fila involucrada
            for(let row = filaInicial; row <= filaFinal; row++){
              //dto con datos de row
              let contenido : ExcelRowDTO = new ExcelRowDTO();
              //iteracion por validaciones
              for(let validacion of this.excelConfig){
                
                let columna = validacion['cell'];
                let celdaStr = columna + row;
                let tipoValidacion = validacion['validationType'];
                let campoRequerido = validacion['required'];

                //aqui va el cambio
                if(tipoValidacion !== 'requireOne' && pesta??a.hasOwnProperty(celdaStr)){
                  let value = pesta??a[celdaStr].v;
                  contenido[validacion.property] = value;
                  continue;
                }
              }//fin de for de iteracion de validaciones
              datos.push(contenido);
            }//fin de for de iteracion de filas
          }//fin de for de iteracion de pesta??as
          console.log(datos);
          this.modal.alert().title('Archivo Correcto').body('Archivo cargado sin observaciones').open();
        }


        /*
        //se obtiene la celda de la primer pesta??a
        let cellCheckformat = workbook.Sheets[sheet]['B2'];
        alert(cellCheckformat.v);
        */
        
      }catch (e){
          console.log(e);
      }
  }

  public getFinalRow(pesta??a:any):number{
    let finalRow : number;
    let dimensiones = pesta??a['!ref'];
    let fields:string[] = dimensiones.split(':');
    let final = fields[1];
    
    for(let i=0; i < final.length; i++){
      if(Number.isNaN(Number(final[i]))){
        continue;
      }else{
        finalRow = Number(final.substring(i));
        break;
      }
    }
    return finalRow;    
  }

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
    if(this.fileIsOver){
      this.fileLoaderMsg = 'Suelte el archivo';
    }else{
      this.fileLoaderMsg = 'Arrastre y suelte archivos desde el escritorio directamente a este di??logo para subirlos aqu??.';
    }
  }

  searchCombos(event:any){
  }

  searchOfertas(event:any){
  }

  getGridDef(gridId:string, contentAttribute:string){
    let obj = this.gridsMap[gridId];
    let arrayOfContent = [];
    if(obj && obj.hasOwnProperty(contentAttribute)){
      arrayOfContent =  obj[contentAttribute];
    }
    let f: any[] = [];
    if(arrayOfContent.length > 0){
      f = arrayOfContent.sort((a, b) => {
          if(parseInt(a.position) > parseInt(b.position)){return 1}
          if(parseInt(a.position) < parseInt(b.position)){return -1}
          else{return 0}
        }
      );
    }
    return f;
  }

  /* onChange paginas*/
  comboChangeEvent(e: any): void {
  }

  showHideCombo(){
    this.seeCombo = !this.seeCombo;
  }
  showHideForm(){
    this.seeForm = !this.seeForm;
  }
  formAndComboHidden(){
    return (!this.seeForm && !this.seeCombo) ? 1 : 0;
  }
  formAndComboShow(){
    return (this.seeForm && this.seeCombo) ? 1 : 0;    
  }
  formOrComboActive(){
    return ((this.seeForm && !this.seeCombo) || (!this.seeForm && this.seeCombo)) ? 1 : 0;
  }

  getLabel(key:string):string{
    if(this.fieldsMap[key] !== undefined){
      let label = this.fieldsMap[key].label;
      return label;
    }else{
      return 'Cargando...';
    }
  }

  isRequired(key:string):boolean{
    if(this.fieldsMap[key] !== undefined){
      let label = this.fieldsMap[key].required;
      return label > 0;
    }else{
      return false;
    }
  }

  isReadOnly(key:string):boolean{
    if(this.fieldsMap[key] !== undefined){
      let readOnly = this.fieldsMap[key].readOnly;
      return readOnly;
    }else{
      return false;
    }
  }

  /* evento onchange de categoria (area)*/
  /* onChange categorias */
  categoriasChangeEvent(e: any): void{
    this.form.categoriaId = parseInt(e.value);
    this.catalogService.getSubCategoriasByCategoriasId(this.form.categoriaId).then(
      data => {
        let subCatTmpData : Select2OptionData[] = [];
        for(let sc of data){
          subCatTmpData.push({id: sc.subCategoriasId, text: sc.name});
        }
        this.subCategoriasOptions = subCatTmpData;
        this.form.subCategoriaId = parseInt(this.subCategoriasOptions[0].id);
        this.subCategoriasMap = this.utilService.getMapFromArray(data, 'subCategoriasId');
      }
    );
  }

    /* evento onchange de categoria (area)*/
 
  /* onChange categorias */
  descripcionComboChangeEvent(e: any): void{
    this.form.descripcionComboId = parseInt(e.value);
  }

   /* onChange categorias */
  descripcionPromocionChangeEvent(e: any): void{
    this.form.descripcionPromocionId = parseInt(e.value);
  }

  subCategoriasChangeEvent(e: any): void{
    this.form.subCategoriaId = parseInt(e.value);
  }

  marcasChangeEvent(e: any): void{
    this.form.marcaId = parseInt(e.value);
  }

  modelosChangeEvent(e: any): void{
    this.form.modeloId = parseInt(e.value);
  }

  presentacionesChangeEvent(e: any): void{
    this.form.presentacionId = parseInt(e.value);
  }

  productosChangeEvent(e: {value: string[]}): void{
    console.log(e.value);
  }

}
