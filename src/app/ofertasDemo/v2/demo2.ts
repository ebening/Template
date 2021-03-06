/**
 * Created by jdominguez on 2/22/17.
 */
import {Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {Eventos} from "../../model/Eventos";
import {FileUploader} from "ng2-file-upload";
import {Select2OptionData} from "ng2-select2";
import {ActivatedRoute, Router} from "@angular/router";
import {StructureService} from "../../service/structure.service";
import {Modal} from "ng2-modal";
import {OfertasData} from "../ofertasDemo.data";
import {CatalogService} from "../../service/catalog.service";
import {Base} from "../../forms/base/base.component";

declare var jQuery: any;
declare let XLSX: any;

@Component({
  selector: 'demo2',
  templateUrl: './demo2.html',
  styleUrls: ['./demo2.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Demo2 extends Base{

  // ******** Variables Motores ********* //

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

  //campos de grids dinamicos
  grids : any[] = [];
  gridsMap : any = {};

  // ******************************* //

  //variable de carga de archivos
  private uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/'});
  private options = {readAs: 'BinaryString'};
  private hasBaseDropZoneOver: boolean = false;

  private fileIsOver : boolean;
  private fileLoaderMsg : string = 'Arrastre y suelte archivos desde el escritorio directamente a este diálogo para subirlos aquí.';
  private fileOk : boolean;

  //x
  private comboOptions : Select2OptionData[] = [];
  private comboMap : any = {};

  /*----------------------------------------------------------------------------------------------------*/

  private showCombos: boolean = false;
  private showAltaForm: boolean = false;

  // ******************* Variables Demo ************************* //

  private select2Options: any = {
   // theme: 'bootstrap',
  };

  @ViewChild('showColumnsModal') modalColumns: Modal;
  private arrayInfoOfertas: any [] = [];
  private auxInfoOfertas: any [] = [];
  private arrayComboDemo: any [] = [];
  private auxComboDemo: any[] = [];
  private arrayCols: any[] = [];

  private addComboShowRow: boolean = false;
  private isEditCombo: boolean = false;
  private isEditOferta: boolean = false;
  private currentCombo: any = {
    combo: '',
    componente: ''
  };

  private currentOferta: any = {
    selected: false, pagina: '',espacio: '',combo: '',componente: '',area: '',grupoarticulos: '',vigencia: '',cobertura: '',
    claveproducto: '',codigobarras: '',descripcion: '',marca: '',modelo: '',size: '',cantidad: '',precioventa: '',preciooferta: '',
    porcentajedescuento: '',preciazoclub: '',vigenciapreciazoclub: '',canonazo: '',descpromo: '',obs: '',recprov: '',costo: '',margen: '',
    rebaja: '',recuperacion: ''
  };

  public categoriasData: Select2OptionData[] = [];
  public subCategoData: Select2OptionData[] = [];

  public categoSelected: any = null;
  public subCategoSelected: any = null;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    private demoData: OfertasData,
    private catalogService: CatalogService,
    structureService : StructureService) {
    super(structureService, router);
  }

  ngOnInit(): void {
    //carga de parametros de entrada
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    this.loadEvento(this.structureDataId);
    this.getView();
    this.initOfertasInfo();
    this.initComboInfo();
    this.buildBase(this.structureDataId, this.versionNum, this.eventoData);
  }

  //funcion para cargar la configuracion de la pantalla
  getView() {
    this.structureService.getViewByAppId(1, this.versionNum).then(
      data => {
        this.viewContent = data;
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
          //armado de mapa de validaciones
          let validations = this.excelValidations.reduce(function (map, obj) {
            map[obj.cell] = obj;
            return map;
          }, {});
          this.excelValidationsMap = validations;
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
          this.getGridDef('ofertas-grid','gridConfig');
        }

      }
    );
  }

  initDataCombos(){
    this.catalogService.getCategorias().then(
      data => {
        this.categoriasData = [];
        this.categoriasData.push({id: '0', text: 'Selecciona'});
        for (let i: number = 0; i < data.length; i++){
          this.categoriasData.push(
            {id: '' + data[i].categoriasId, text: data[i].nombre}
          );
        }
      }
    );
  }

  onCategoriaSelected(event){
    if (event.value > 0){
      this.catalogService.getCategoriaById(event.value as number).subscribe(
        data => {
          let x = JSON.parse(JSON.parse(JSON.stringify(data))._body);
          this.currentOferta.area = x.nombre;
          this.categoSelected = x;
        }
      );
      this.catalogService.getSubCategoriasByCategoriasId(event.value).then(
        data => {
          this.subCategoData = [{id: '0', text: 'Selecciona'}];
          for (var i: number = 0; i < data.length; i++){
            this.subCategoData.push(
              {id: '' + data[i].subCategoriasId, text: data[i].nombre}
            );
          }
        }
      );
    }
  }

  onSubCategoriaSelected(event){
    if (event.value > 0){
      this.catalogService.getSubCategoriaById(event.value as number).subscribe(
        data => {
          let x = JSON.parse(JSON.parse(JSON.stringify(data))._body);
          this.currentOferta.grupoarticulos = x.nombre;
          this.subCategoSelected = x;
        }
      );
    }
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
    console.log("TEST--------");
    let totales=  this.gridsMap[gridId].viewGrids.length;
    console.log(totales);
    return totales;
  }

  alsuperFinish(){
    this.finalizarCaptura();
  }

  loadEvento(structureDataId : number){
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;
      });
  }

  initOfertasInfo(){
    this.arrayInfoOfertas = this.demoData.staticInitData;
    this.auxInfoOfertas = Object.assign([], this.demoData.staticInitData);
  }

  onClickRowOferta(obj){
    obj.selected = !obj.selected;
    if (this.addComboShowRow == true){
      let tempArraySelected: any[] = this.arrayInfoOfertas.filter(x => x.componente == obj.componente);
      for (let i: number = 0; i < tempArraySelected.length; i++){
        tempArraySelected[i].selected = obj.selected;
      }
      if (obj.selected == true){
        let temp: string = this.currentCombo.componente;
        temp = temp + (temp.length == 0 ? "" : ",") + obj.componente;
        this.currentCombo.componente = temp;
      }else{
        let array: string[] = this.currentCombo.componente.split(",");
        array.splice(array.indexOf(obj.componente), 1);
        var finalStr: string = '';
        for (let i: number = 0; i < array.length; i++){
          finalStr = finalStr + array[i];
          if (i < array.length - 1){
            finalStr = finalStr + ",";
          }
        }
        this.currentCombo.componente = finalStr;
      }
    }
  }

  unSelectAllRowsOfertas(){
    let temp: any [] = this.arrayInfoOfertas.filter(x => x.selected == true);
    for (let i: number = 0; i < temp.length; i++){
      temp[i].selected = false;
    }
  }

  onEditOferta(oferta: any){
    this.unSelectAllRowsOfertas();
    oferta.selected = true;
    this.currentOferta = oferta;
    if (this.showAltaForm == false){
      this.openAltaForm();
    }
  }

  openAltaForm(){
    this.showAltaForm = !this.showAltaForm;
    if (this.showAltaForm == true){
      this.initDataCombos();
    }
  }

  onSaveOferta(){
    if (this.isEditOferta == false){
      this.arrayInfoOfertas.push(this.currentOferta);
      this.auxInfoOfertas = Object.assign([], this.arrayInfoOfertas);
      this.cleanForm();
    }else{
      this.currentOferta.selected = false;
      this.cleanForm();
    }
  }

  searchOfertaOnTable(event){
    let text: string = event.target.value;
    this.auxInfoOfertas = this.arrayInfoOfertas.filter(x =>
      x.area.includes(text) || x.grupoarticulos.includes(text) || x.claveproducto.includes(text) ||
      x.codigobarras.includes(text) || x.descripcion.includes(text) || x.marca.includes(text));
  }

  searchComboOnTable(event){
    let text: string = event.target.value;
    this.auxComboDemo = this.arrayComboDemo.filter(x =>
      x.combo.includes(text) || x.componente.includes(text));
  }

  deleteOferta(oferta: any){
    this.auxInfoOfertas.splice(this.auxInfoOfertas.indexOf(oferta), 1);
    this.arrayInfoOfertas.splice(this.arrayInfoOfertas.indexOf(oferta), 1);
  }

  cleanForm(){
    this.currentOferta = {
      selected: false, pagina: '',espacio: '',combo: '',componente: '',area: '',grupoarticulos: '',vigencia: '',cobertura: '',
      claveproducto: '',codigobarras: '',descripcion: '',marca: '',modelo: '',size: '',cantidad: '',precioventa: '',preciooferta: '',
      porcentajedescuento: '',preciazoclub: '',vigenciapreciazoclub: '',canonazo: '',descpromo: '',obs: '',recprov: '',costo: '',margen: '',
      rebaja: '',recuperacion: ''
    };
    this.initDataCombos();
    this.subCategoData = [];
  }

// ****************** Combos ******************* //
  initComboInfo(){
    this.arrayComboDemo = this.demoData.comboTableData;
    this.auxComboDemo = Object.assign([], this.demoData.comboTableData);
  }

  showRowAddCombo(){
    this.addComboShowRow = true;
    var lastId = 0;
    if (this.arrayComboDemo.length > 0){
      lastId = this.arrayComboDemo[this.arrayComboDemo.length - 1].combo as number;
    }
    lastId++;
    this.currentCombo.combo = lastId;
  }

  hideRowCombo(){
    this.addComboShowRow = false;
    this.isEditCombo = false;
    this.currentCombo = {
      combo: '',
      componente: ''
    }
  }

  addComboAction(){
    if (this.isEditCombo == false){
      this.arrayComboDemo.push(this.currentCombo);
      this.auxComboDemo = Object.assign([], this.arrayComboDemo);
    }
    this.currentCombo = {
      combo: '',
      componente: ''
    };
    this.addComboShowRow = false;
    this.isEditCombo = false;
    this.unSelectAllRowsOfertas();
  }

  editComboAction(comboObj: any){
    this.currentCombo = comboObj;
    this.addComboShowRow = true;
    this.isEditCombo = true;
    let xsplit: string[] = this.currentCombo.componente.split(",");
    for (let i: number = 0; i < xsplit.length; i++){
      let array: any[] = this.arrayInfoOfertas.filter(x => x.componente == xsplit[i]);
      for (let j: number = 0; j < array.length; j++){
        array[j].selected = true;
      }
    }
  }

  deleteCombo(comboObj: any){
    this.arrayComboDemo.splice(this.arrayComboDemo.indexOf(comboObj), 1);
  }
// ******************************************** //
  //funcion para regresar a bandeja
  cancel(){
    this.router.navigateByUrl('app');
  }

  showColumnHiddenModal(){
    this.modalColumns.open();
  }

  closeColumnHiddenModal(){
    this.modalColumns.close();
  }

  applyColumnView(){
    // Mandar grabar la base de datos
    this.modalColumns.close();
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
        //this.modal.alert().title('Error al finalizar captura').body(error._body).open();
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
        //this.modal.alert().title('Error al finalizar captura').body(error._body).open();
      }
    );
  }

  showComboAction(){
    this.showCombos = !this.showCombos;
  }

  onFileDropDemo(file: File){
    for (let i: number = 0; i < this.demoData.staticExcellData.length; i++){
      this.arrayInfoOfertas.push(this.demoData.staticExcellData[i]);
      this.auxInfoOfertas.push(this.demoData.staticExcellData[i]);
    }
  }

  onFileDrop(file: File): void {
    var hasRowsError: boolean = false;
    var alertMjs: string = '';
    try {
      //se obtiene el libro
      var workbook = XLSX.read(file, {type: 'binary', encoding: 'utf8'});
      //se obtienen las pestañas
      var sheets: string[] = workbook.SheetNames;
      //se obtiene el nombre de la primer pestaña
      let sheet = sheets[0];

      let isFileOk : boolean = true;
      //por cada validacion, configurada, se saca el archivo y se cotejan los datos:
      for(let validation of this.excelValidations){
        let options : string [] = validation.posibleValues.split(",");
        let cellValue : string = (workbook.Sheets[sheet][validation.cell]).v;
        if(options.indexOf(cellValue) == -1){
          isFileOk = false;
          break;
        }
      }

      this.fileOk = isFileOk;
      if(!isFileOk){
        //this.modal.alert().title('Error al importar desde Excel').body('El archivo cargado no cuenta con el formato configurado en la herramienta. Verifique.').open();
      }else{
        //this.modal.alert().title('Archivo Correcto').body('El archivo cargado cuenta con el formato correcto. Procesando...').open();
      }


      /*
       //se obtiene la celda de la primer pestaña
       let cellCheckformat = workbook.Sheets[sheet]['B2'];
       alert(cellCheckformat.v);
       */

    }catch (e){
      console.log(e);
    }
  }

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
    if(this.fileIsOver){
      this.fileLoaderMsg = 'Suelte el archivo';
    }else{
      this.fileLoaderMsg = 'Arrastre y suelte archivos desde el escritorio directamente a este diálogo para subirlos aquí.';
    }
  }

  searchCombos(event:any){
    console.log("buscando combos");
  }

  searchOfertas(event:any){
    console.log("buscando ofertas");
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
    console.log(f);
    this.arrayCols = f;
  }

  /* onChange paginas*/
  comboChangeEvent(e: any): void {
  }

}
