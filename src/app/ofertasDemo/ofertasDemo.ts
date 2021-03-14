/**
 * Created by jdominguez on 2/14/17.
 */



import {Component, ViewEncapsulation, ChangeDetectorRef, ViewChild} from "@angular/core";
import {OfertasData} from "./ofertasDemo.data";
import {UtilService} from "../service/util.service";
import {VigenciaEditor} from "./editors/vigenciaEditor";
import {CategoriaEditor} from "./editors/categoriaEditor";
import {SubCategoEditor} from "./editors/subcategoEditor";
import {CatalogService} from "../service/catalog.service";
import {Modal} from "ng2-modal";
import {LocalDataSource} from "ng2-smart-table";
import {Eventos} from "../model/Eventos";
import {StructureService} from "../service/structure.service";
import {ActivatedRoute} from "@angular/router";

declare let XLSX: any;

interface SmartColumn {
  [name: string]: {};
}

@Component({
  selector: 'ofertasDemo',
  templateUrl: './ofertasDemo.html',
  styleUrls: ['./ofertasDemo.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OfertasDemo {

  /* *********+ Variables Motores *********** */

  private structureDataId : number = 0;
  private versionNum : number = 0;
  private eventoData : Eventos = new Eventos();

  //informacion de la configuracion de la vista
  private viewTitle : string = "";
  private viewContent : any = {};

  private viewActions : any[] = [];
  private actionsMap : any = {};

  /* ********************************************************** */

  @ViewChild('showColumnsModal') modalColumns: Modal;

  private sourceTableOfertas: LocalDataSource;

  private widthdivTable: string = '4500px';
  private fixWidth: number = 160;

  private settingsTable;
  private settingsTableCombo;
  private fechaSelected: Date = new Date();
  private fechaInicialOpts: any = {};
  private hasBaseDropZoneOver: boolean = false;

  constructor(
    private dataDemo: OfertasData,
    private util: UtilService,
    private catalogService: CatalogService,
    private structureService : StructureService,
    private route: ActivatedRoute,
    private dc: ChangeDetectorRef)
  {
    this.settingsTable = util.getNewSmartTableSettings();
    this.settingsTableCombo = util.getNewSmartTableSettings();
    this.settingsTable.pager = {
      display: true,
      perPage: 5
    };
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
  }


  ngOnInit(){
    //  this.loadEvento(this.structureDataId);
    this.initSmartColumns(false);
    this.initSmartColumnsComboTable();
    this.initDataCombos();
    this.fechaInicialOpts = this.util.loadDateOptions(new Date(), null);
    this.sourceTableOfertas = new LocalDataSource();
    this.sourceTableOfertas.load(this.dataDemo.staticInitData).then();
  }


  loadEvento(structureDataId : number){
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;
      });
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

        /*si aplica export de excel
        if(this.viewContent.applyExcelImport != null && this.viewContent.applyExcelImport){
          this.excelValidations = data.viewExcelValidations;
          //armado de mapa de validaciones
          let validations = this.excelValidations.reduce(function (map, obj) {
            map[obj.cell] = obj;
            return map;
          }, {});
          this.excelValidationsMap = validations;
        } */
      }
    );
  }

  initDataCombos(){
    this.catalogService.getCategorias().then(
      data => {
        this.dataDemo.categoriasData = [];
        this.dataDemo.categoriasData.push({id: '0', text: 'Selecciona'});
        for (let i: number = 0; i < data.length; i++){
          this.dataDemo.categoriasData.push(
            {id: '' + data[i].categoriasId, text: data[i].nombre}
          );
        }
      }
    );
  }

  showColumnHiddenModal(){
    this.modalColumns.open();
  }

  closeColumnHiddenModal(){
    this.modalColumns.close();
  }

  initSmartColumnsComboTable(){
    let cols: SmartColumn = {};
    cols['combo'] = {
      title: 'Combo'
    };
    cols['componente'] = {
      title: 'Componente'
    };
    this.settingsTableCombo.columns = cols;
  }

  initSmartColumns(closeModal: boolean){
    this.settingsTable = this.util.getNewSmartTableSettings();
    this.settingsTable['pager'] = {
      display: true,
      perPage: 8
    };
    let cols: SmartColumn = {};
    var countColumns: number = 0;
    for (var i: number = 0; i < this.dataDemo.columnas.length; i++){
      if (this.dataDemo.columnas[i].show == true){
        countColumns++;
        cols[this.dataDemo.columnas[i].key] = {
          title: this.dataDemo.columnas[i].label
        };
        switch(i){
          case 4:
            cols[this.dataDemo.columnas[i].key]['editor'] = {
              type: 'custom',
              component: CategoriaEditor
            };
            break;
          case 5:
            cols[this.dataDemo.columnas[i].key]['editor'] = {
              type: 'custom',
              component: SubCategoEditor
            };
            break;
          case 6:
            cols[this.dataDemo.columnas[i].key]['editor'] = {
              type: 'custom',
              component: VigenciaEditor,
              class: 'vigencia'
            };
            break;
          case 21:
            cols[this.dataDemo.columnas[i].key]['editor'] = {
              type: 'textarea'
            };
            break;
        }
      }
    }
    this.settingsTable.columns = cols;
    let width = countColumns * this.fixWidth;
    this.widthdivTable = width + 'px';
    if (closeModal == true){
      this.modalColumns.close();
    }
  }

  confirmDelete(event){
    if (confirm("Desea eliminar registro ?")){
      event.confirm.resolve();
    }else{
      event.confirm.reject();
    }
  }

  public fileOver(fileIsOver: boolean): void {
    this.hasBaseDropZoneOver = fileIsOver;
  }

  public onFileDrop(file: File): void {
    if (this.sourceTableOfertas == null){
      this.sourceTableOfertas = new LocalDataSource();
    }
    for (var i: number = 0; i < this.dataDemo.staticExcellData.length; i++){
      this.sourceTableOfertas.append(this.dataDemo.staticExcellData[i]).then(
        data => {
          let x = data;
        }
      );
    }

  /*  var hasRowsError: boolean = false;
    var alertMjs: string = '';
    let ofertasNuevas: ArqTableModel[] = [];
    try {
      var workbook = XLSX.read(file, {type: 'binary'});
      var sheets: string[] = workbook.SheetNames;
      let cellCheckformat = workbook.Sheets[sheets[0]]['B2'];
      if (cellCheckformat == null || cellCheckformat.v.toUpperCase() != 'FESTIVAL:'){
        throw new TypeError('Archivo seleccionado no corresponde al formato establecido');
      }
      sheets.forEach(x => {
        let worksheet = workbook.Sheets[x];
        var isLastRow = false;
        for (var i: number = 11; !isLastRow; i++) {
          let cell = worksheet['C' + i];
          if (cell != null) {
            let cellData = worksheet['D' + i];
            if (cellData != null) {
              let subCatego: CatSubcategory = this.subCategoService.getSubCategoByName(worksheet['C' + i].v);
              if (subCatego == null || isNaN(Number(worksheet['K' + i] == null ? 0.00 : worksheet['K' + i].v))) {
                console.log("Sheet: " + x + " => Row without Process: " + i + " => Value: " + cellData.v);
                hasRowsError = true;
                alertMjs = alertMjs + "Hoja: " + x + " => Registro: " + i + " *** ";
                continue;
              }
              let row: ArqTableModel = new ArqTableModel();
              row.area = worksheet['B' + i].v as number;
              row.subSeg = cellData.v;
              row.grupoArt = subCatego.id;
              row.precioOferta = worksheet['K' + i] == null ? 0.00 : Number(worksheet['K' + i].v);
              row.preciazoClub = worksheet['L' + i] == null ? '' : worksheet['L' + i].v;
              row.vigencia = worksheet['M' + i] == null ? '' : worksheet['M' + i].v;
              row.obs = worksheet['N' + i] == null ? '' : worksheet['N' + i].v;
              ofertasNuevas.push(row);
            }
          } else if (worksheet['C' + (i + 1)] == null) {
            isLastRow = true;
          }

        }
      });
      this.ofertas = this.ofertas.concat(ofertasNuevas);
      if (hasRowsError == true) {
        this.util.callAlert('Registros sin Procesar', alertMjs, this.util.DANGER_ALERT, 'openOfertasAlert');
      }
    }catch (e){
      var msj:string = 'Error Desconocido';
      if (e instanceof TypeError){
        msj = 'Archivo seleccionado no corresponde al formato establecido';
      }else if (e instanceof Error){
        msj = 'Archivo no es tipo Excel (XLS ó XLSX) o esta dañado';
      }
      this.util.callAlert('Error Validacion Archivo', msj , this.util.DANGER_ALERT, 'openOfertasAlert');
    }
    */
  }

}
