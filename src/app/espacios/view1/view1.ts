/**
 * Created by jdominguez on 2/1/17.
 */
import {
  Component, ViewChild, style, animate, transition, trigger, ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import {EtiquetaService} from "../../service/etiquetas.service";
import {UtilService} from "../../service/util.service";
import {CatalogService} from "../../service/catalog.service";
import {UdpMediosEspaciosService} from "../../service/sp/udpMediosEspacios.service";
import {UdpMediosEspaciosSel} from "../../model/sp/UdpMediosEspaciosSel";
import {MediosEspacios} from "../../model/sp/MediosEspacios";
import {Modal} from "ng2-modal";
import {Usuarios} from "../../model/Usuarios";
import {Observable} from "rxjs";
import {MensajeService} from "../../service/mensajes.service";
import {Router, ActivatedRoute} from "@angular/router";
import {StructureService} from "../../service/structure.service";
import {Color} from "ng2-charts";
import {Espaciosubicaciones} from "../../model/Espaciosubicaciones";
import {EspaciosUbicacionesService} from "../../service/espaciosUbicaciones.service";
import {MecanicasProdService} from "../../service/mecanicasProductos.service";
import {Base} from "../../forms/base/base.component";
import {UdpMediosUpsMerza} from "../../model/sp/UdpMediosUpsMerza";

interface WaitingToSave {
  eventoId: number;
  medioId: number;
  subCategoriaId: number;
  mecanicaId: number[];
}



@Component({
  selector: 'view1',
  templateUrl: './view1.html',
  styleUrls: ['./view1.scss', './charts.style.scss'],
  animations: [
    trigger(
      'msjShow', [
        transition('void => *', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition('* => void', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
  encapsulation: ViewEncapsulation.None,
})
export class View1 extends Base {

  private windowTitle: string = '';

  // ********* Variables Graficas ********* //
  private totalChartLabels:string[] = ['Sin Asignar', 'Asignados '];
  private totalChartData:number[] = [100, 50,];
  private totalChartType:string = 'doughnut';
  private medioChartData: number[] = [50, 25];
  private colors: Array<Color> = [
    {
      backgroundColor: [
        "#fa343d",
        "#47cb3e"
      ]
    }
  ];

  @ViewChild('tipoMedioChart') tipoMedioChart;

  private chartTipoMedioLabels: string[] = [];
  private chartTipoMedioType: string = 'pie';
  private chartTipoMedioData: number[] = [50,25,10,30,30];
  private chartTupoMedioColors: Array<Color> = [
    {
      backgroundColor: [
        "#fa343d",
        "#47cb3e",
        "#fabf4e",
        "#5149cb",
        "#2efaed",
        "#cb6840",
        "#f5fa50",
        "#1b6c41"
      ]
    }
  ];

  // ********** Variables Flujo ********** //
  //private structureDataId: number = 0;
  //private versionNum: number = 0;
  //private eventoData: Eventos = new Eventos();

  // ********* Variables Flujo Pantalla ********* //

  private dataId: number = 0;
  private dataContent: any = {};
  private viewConfig: any = [];
  private fieldsMap: any = {};
  private actionsMap : any = {};
  private viewActions : any[] = [];

  // ************** Mensajes ********** //
  private hasMsj: boolean = false;
  private mensajeAlert: string = '';
  private classMsjInfo: boolean = false;
  private classMsjDanger: boolean = true;

  // ******************************* //
  private medioSelectedId: number = 0;
  private medioSelectedDesc: string = '';

  private totalEspaciosChart: any;
  private totalEspaciosSelected: any;

  // ********** Copy Variables ******* //
  @ViewChild('confirmCopy') modal: Modal;
  private copySelected: boolean = false;
  private sourceId: number;
  private targetId: number;
  private msjConfirm: string;


  // *************************** //

  private udpMediosEspaciosSel: UdpMediosEspaciosSel = new UdpMediosEspaciosSel();
  private aux: MediosEspacios[] = [];
  private mediosCategorias: any[] = [];
  private auxMediosCategos: any[] = [];

  private espaciosProductos: any[] = [];
  private auxEspaciosProd: any[] = [];

  private todoSelected: boolean = false;

  // ********* MERZA ******** //
  private tipoMedios: any[];
  private tipoMediosCheckBox: any[] = [];
  private tipoMediosList: any[] = [];
  private espaciosUbicacines: Espaciosubicaciones[] = [];

  private mecanicasProductos: any[] = [];
  private auxMecanicasProductos: any[] = [];

  private mecanicasProductosSelected: any = {};
  private toSaveMZ: UdpMediosUpsMerza[] = [];

  // ********************* //

  @ViewChild('cancelAct') modalCancel: Modal;
  private msjCancelarActividad: string;

  private subCategoSelected: number;
  private subCategoSel: any;
  private toSave: WaitingToSave[] = [];

  private finishBttnDisabled: boolean = false;
  private showCopyFunction: boolean = true;

  constructor(private etService: EtiquetaService,
              private util: UtilService,
              private catalogService: CatalogService,
              private mediosEspaciosService: UdpMediosEspaciosService,
              private msjService: MensajeService,
              private route: ActivatedRoute,
              private dc: ChangeDetectorRef,
              private espUbic: EspaciosUbicacionesService,
              private mecProdService: MecanicasProdService,
              public router: Router,
              public structureService: StructureService) {
    super(structureService, router);
  }


  ngOnInit() {
    this.etService.updateEtiquetas();
    this.structureDataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    this.loadEvento(this.structureDataId);
    this.getView();
  }

  getView() {
    this.structureService.getViewByAppId(1, 4).then(
      data => {
        this.dataContent = data;
        this.windowTitle = this.dataContent.viewTitle;
        this.viewConfig = this.dataContent.viewConfig || [];
        this.viewActions = data.viewAction || [];
        //armado de mapa a partir de campos
        var result = this.viewConfig.reduce(function (map, obj) {
          map[obj.htmlId] = obj;
          return map;
        }, {});
        //asignado a variable de instancia
        this.fieldsMap = result;

        let actionsResult = this.viewActions.reduce(function (map, obj) {
          map[obj.htmlId] = obj;
          return map;
        }, {});
        this.actionsMap = actionsResult;

        // Inicializando dependiendo si el componente se va visualizar

       /* if (this.isShow('espacios_panel_tipoMedios') == true){
          this.initTipoMedios();
        }
        if (this.isShow('espacios_panel_espacioPromocional') == true){
          this.initEspaciosUbic();
        } */
        if (this.isShow('espacios_view2_tableProductosOferta') == true){
          this.initMecanicasProductos();
        }
        if (this.isShow('espacios_view1_indicador_tipoMedio') == true){
          this.initIndicadoresMediosOferta();
        }

        // *************************************
      }
    );
  }

  /*Carga del evento*/
  loadEvento(structureDataId: number) {
    this.structureService.getEventoByStructureDataId(structureDataId).then(
      data => {
        this.eventoData = data;
        this.loadMedios();
      }
    );
  }

  /*Carga Medios Tabla 1 */
  loadMedios(){
    this.mediosEspaciosService.selectMediosEspacios(this.eventoData.eventosId).subscribe(
      data => {
        this.udpMediosEspaciosSel = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.aux = this.udpMediosEspaciosSel.mediosEspaciosList;
        this.totalChartData = [this.udpMediosEspaciosSel.total - this.udpMediosEspaciosSel.asignados, this.udpMediosEspaciosSel.asignados];
      /*  if (this.udpMediosEspaciosSel.total == this.udpMediosEspaciosSel.asignados){
          this.finishBttnDisabled = false;
        }else{
          this.finishBttnDisabled = true;
        } */
        this.finishBttnDisabled = false;  // Temporalmente
        this.dc.detectChanges();
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');

        }
      }
    );
  }

  initIndicadoresMediosOferta(){
    let model = {
      eventosId: this.eventoData.eventosId,
      usuariosId: this.util.getUsuarioLogged().usuariosId
    };
    this.mediosEspaciosService.getIndicadoresMediosOfertas(model).subscribe(
      data => {
        this.chartTipoMedioLabels = [];
        this.chartTipoMedioData = [];
        let response: any = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.totalChartData[0] = response.totales[0].total - response.totales[0].asignados;
        this.totalChartData[1] = response.totales[0].asignados;
        let tipoMedios: any[] = response.tipoMedio;
        for (let i: number = 0; i < tipoMedios.length; i++){
          //this.chartTipoMedioLabels[i] = tipoMedios[i].medios;
          //this.chartTipoMedioData[i] = tipoMedios[i].ofertas;
        }
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  initTipoMedios() {
    let model = {
      eventosId: this.eventoData.eventosId,
      mecanicasId: this.mecanicasProductosSelected.mecanicasId,
      usuariosId: this.util.getUsuarioLogged().usuariosId
    };
    this.mediosEspaciosService.getTipoMedioByMecanica(model).subscribe(
      data => {
        this.tipoMediosList = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  initEspaciosUbic(){
    this.espUbic.getList().subscribe(
      data => {
        this.espaciosUbicacines = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  setCategoriaSelected(subCategoId: number){
    for (var i: number = 0; i < this.auxMediosCategos.length; i++){
      this.auxMediosCategos[i].selected = false;
    }
    this.auxMediosCategos.filter(x => x.subcategoriasId == subCategoId)[0].selected = true;
  }

  setMedioSelected(){
    for (var i: number =0; i < this.aux.length; i++){
      this.aux[i].selected = false;
    }
    this.aux.filter(x => x.mediosId == this.medioSelectedId)[0].selected = true;
  }

  selectMedio(medioId: number, medioDesc: string) {
    this.espaciosProductos = [];
    this.auxEspaciosProd = [];
    this.todoSelected = false;
    this.medioSelectedId = medioId;
    this.medioSelectedDesc = medioDesc;
    this.setMedioSelected();
    let userLogged: Usuarios = this.util.getUsuarioLogged();

    if (this.isShow('espacios_view2_tableEspaciosCat') == true){
      this.selectMedioALS(medioId, 0, userLogged.usuariosId);
    }

    if (this.isShow('espacios_view2_tableProductosOferta') == true){
      this.selectMedioMZ(userLogged.usuariosId);
    }

  }

  selectMecanicasProductos(mp: any){
    this.mecanicasProductosSelected = mp;
    this.mecanicasProductosSelected.seleccionado = !this.mecanicasProductosSelected.seleccionado;
    this.initTipoMedios();
  }

  initMecanicasProductos(){
    let user: Usuarios = this.util.getUsuarioLogged();
    let model = {
      usuariosId: user.usuariosId
    };
    this.mecProdService.getMecanicasByMedioId(model).subscribe(
      data => {
        this.mecanicasProductos = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.auxMecanicasProductos = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  selectMedioMZ (usuarioId: number){

  }

  selectMedioALS(medioId: number, statusId: number, usuarioId: number){
    this.mediosEspaciosService.selectEspaciosCategorias(medioId,statusId,usuarioId).subscribe(
      data => {
        this.mediosCategorias = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.auxMediosCategos = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.setMedioSeleccionadoIndicador();
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  setMedioSeleccionadoIndicador(){
    let medioSelectedArray: MediosEspacios[] = this.aux.filter(x => x.mediosId == this.medioSelectedId);
    this.medioChartData = [medioSelectedArray[0].total - medioSelectedArray[0].asignados, medioSelectedArray[0].asignados];
  }

  selectCategoria(subCategoId: number){
    this.subCategoSelected = subCategoId;

    this.subCategoSel = this.auxMecanicasProductos.filter(x => x.subCategoriaId == subCategoId)[0];

    this.setCategoriaSelected(subCategoId);
    let userLogged: Usuarios = this.util.getUsuarioLogged();
    let modelToSend = {
      mediosId: this.medioSelectedId,
      subCategoId: subCategoId,
      userId: userLogged.usuariosId
    };
    this.mediosEspaciosService.selectEspaciosProductos(modelToSend).subscribe(
      data => {
        this.espaciosProductos = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        this.auxEspaciosProd = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        let temp = this.espaciosProductos.filter(x => x.seleccionado == false);
        if (temp.length == 0 && this.espaciosProductos.length > 0){
          this.todoSelected = true;
        }else{
          this.todoSelected = false;
        }
        this.checkReadyToSave();
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g, '');
          this.showMsj(this.mensajeAlert, 'danger', 3000);
        }
      }
    );
  }

  terminarActividad(){
    if (this.toSave.length > 0){
      if (confirm("Existen cambios sin guardar. Desea Continuar ?")){
        this.finishMethod();
      }
    }else{
      //this.ejecutarTerminar();
      this.finishMethod();
    }
  }

  ejecutarTerminar(){

  }

  guardarTodoMerza(){
    if (this.toSaveMZ.length > 0){
      this.mediosEspaciosService.guardarTodoMZ(this.toSaveMZ).subscribe(
        data => {
          this.showMsj("Informacion Guardada con Exito", 'info', 3000);
          this.toSaveMZ = [];
          this.loadMedios();
        },
        error => {
          console.log(error);
          if (!(error._body instanceof ProgressEvent)) {
            let tm1: string[] = error._body.split(',');
            let tm2: string[] = tm1[4].split(':');
            this.showMsj(tm2[1].replace(/[\[\]"]+/g, ''), 'danger', 3000);
          }
        }
      );
    }
  }

  guardarTodoAlSuper(){
    this.mediosEspaciosService.guardarTodoAlSuper(this.toSave).subscribe(
      data =>{
        this.showMsj("Informacion Guardada con Exito", 'info', 3000);
        this.toSave = [];
        this.loadMedios();
        this.espaciosProductos = [];
        this.auxEspaciosProd = [];
        this.mediosCategorias = [];
        this.auxMediosCategos = [];
        //this.medioSelectedId = 0;
        //this.medioSelectedDesc = '';
        this.selectMedio(this.medioSelectedId, this.medioSelectedDesc);
      },
      error =>{
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.showMsj(tm2[1].replace(/[\[\]"]+/g, ''), 'danger', 3000);
        }
      }
    );
  }

  checkReadyToSave(){
    for (let i: number = 0; i < this.auxEspaciosProd.length; i++){
      let temp = this.toSave.filter(x => x.subCategoriaId == this.subCategoSelected && x.medioId == this.medioSelectedId);
      if (temp.length > 0){
        let mecanicas: number[] = temp[0].mecanicaId;
        if (mecanicas.indexOf(this.auxEspaciosProd[i].mecanicasId) > -1){
          this.auxEspaciosProd[i].seleccionado = true;
        }else{
          this.auxEspaciosProd[i].seleccionado = false;
        }
      }
    }
    let checkTodo = this.auxEspaciosProd.filter(x => x.seleccionado == false);
    this.todoSelected = checkTodo.length <= 0 && this.auxEspaciosProd.length > 0;
  }

  selectOferta(mecanicaId: number, comeSelectAll: boolean){
    let temp = this.auxEspaciosProd.filter(x => x.seleccionado == false);
    let mecanicaSelected = this.auxEspaciosProd.filter(x => x.mecanicasId == mecanicaId)[0];
    if (temp.length == 0 && comeSelectAll == false){
      this.todoSelected = true;
    }else if (comeSelectAll == false){
      this.todoSelected = false;
    }
    let auxSave = this.toSave.filter(x => x.medioId == this.medioSelectedId && x.subCategoriaId == this.subCategoSelected);
    if (auxSave.length == 0){
      let array: number[] = [];
      let mecanicaSelected = this.auxEspaciosProd.filter(x => x.seleccionado == true);
      for (var i: number = 0; i < mecanicaSelected.length; i++){
        array.push(mecanicaSelected[i].mecanicasId);
      }
      let y: WaitingToSave = {
        eventoId: this.eventoData.eventosId,
        medioId: this.medioSelectedId,
        subCategoriaId: this.subCategoSelected,
        mecanicaId: array
      };
      this.toSave.push(y);
    }else if (mecanicaSelected.seleccionado == true){
      auxSave[0].mecanicaId.push(mecanicaId);
    }else if (mecanicaSelected.seleccionado == false && auxSave.length > 0){
      let index: number = auxSave[0].mecanicaId.findIndex(x => x == mecanicaId);
      if (index > -1){
        auxSave[0].mecanicaId.splice(index, 1);
      }
    }
    console.log(this.toSave);
  }

  searchTableMedios(event: any) {
    let text = event.target.value;
    this.aux = this.udpMediosEspaciosSel.mediosEspaciosList.filter(
      x => x.descripcion.includes(text)
    );
  }

  searchTableCategorias(event: any){
    let text = event.target.value;
    this.auxMediosCategos = this.mediosCategorias.filter(
      x => x.desCategoria.includes(text) || x.desSubCategoria.includes(text)
    );
  }

  searchTableCategos2(event: any){
    let text = event.target.value;
    this.auxEspaciosProd = this.espaciosProductos.filter(
      x => x.producto.includes(text)
    );
  }

  selectAll(){
    for (var i: number = 0; i < this.auxEspaciosProd.length; i++){
      this.auxEspaciosProd[i].seleccionado = this.todoSelected;
      this.selectOferta(this.auxEspaciosProd[i].mecanicasId, true);
    }
  }

  confirmPasteFunction() {
    let userLogged: Usuarios = this.util.getUsuarioLogged();
    let modelToSend = {
      sourceId: this.sourceId,
      targetId: this.targetId,
      userId: userLogged.usuariosId
    };
    this.mediosEspaciosService.copyMecanicasSel(modelToSend).subscribe(
      data => {
        console.log(data);
        this.showMsj('Informacion Copiada', 'info', 3000);
        this.loadMedios();
        this.selectMedio(this.medioSelectedId, this.medioSelectedDesc);
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.showMsj(tm2[1].replace(/[\[\]"]+/g, ''), 'danger', 3000);
        }
      }
    );
    this.modal.close();
  }

  pasteFunction(target: number) {
    this.targetId = target;
    let userLogged: Usuarios = this.util.getUsuarioLogged();
    let modelToSend = {
      sourceId: this.sourceId,
      targetId: this.targetId,
      userId: userLogged.usuariosId
    };
    this.mediosEspaciosService.copyMecanicasVal(modelToSend).subscribe(
      data => {
        let response = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        if (response.sourceNumber == 0) {
          this.showMsj("Medio Origen no tiene espacios asignados", 'danger', 3000);
        } else {
          this.msjConfirm = 'Esta seguro de pasar la informacion, lo que existe en Medio Destino se perder??';
          this.modal.open();
        }
      },
      error => {
        console.log(error);
        if (!(error._body instanceof ProgressEvent)) {
          let tm1: string[] = error._body.split(',');
          let tm2: string[] = tm1[4].split(':');
          this.showMsj(tm2[1].replace(/[\[\]"]+/g, ''), 'danger', 3000);
        }
      }
    );
  }

  resetCopyFunction() {
    this.copySelected = false;
    this.sourceId = 0;
    this.targetId = 0;
    this.modal.close();
  }

  prepareToCopy(source: number) {
    this.copySelected = true;
    this.sourceId = source;
  }

  cancelActividad() {
    this.msjService.getMsjByKey('msj.espacios.cancelar').subscribe(
      data => {
        this.msjCancelarActividad = JSON.parse(JSON.stringify(data))._body;
        this.modalCancel.open();
      },
      error => {

      }
    );
  }

  closeCancelModal() {
    this.modalCancel.close();
  }

  showMsj(msj: string, msjClass: string, ms: number) {
    this.hasMsj = true;
    this.mensajeAlert = msj;
    this.setClassAlert(msjClass);
    let timer = Observable.timer(ms);
    timer.subscribe(x => this.closeMsj());
  }

  setClassAlert(msjClass: string) {
    this.classMsjDanger = false;
    this.classMsjInfo = false;
    switch (msjClass) {
      case 'danger':
        this.classMsjDanger = true;
        break;
      case 'info':
        this.classMsjInfo = true;
        break;
    }
  }

  closeMsj() {
    this.hasMsj = false;
  }

  isShow(variable: string): boolean {
    if (this.fieldsMap.hasOwnProperty(variable)) {
      return true;
    } else {
      return false;
    }
  }
}
