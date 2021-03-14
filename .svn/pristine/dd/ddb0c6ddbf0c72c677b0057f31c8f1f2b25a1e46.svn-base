/**
 * Created by jdominguez on 1/20/17.
 */

import {Component, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {UtilService} from "../../service/util.service";
import {EtiquetaService} from "../../service/etiquetas.service";
import {EventoService} from "../../service/evento.service";
import {Router, ActivatedRoute} from "@angular/router";
import {StructureService} from "../../service/structure.service";
import {Eventos} from "../../model/Eventos";
import {AddEventoModel} from "../../model/AddEventoModel";
import {StructureData} from "../../model/StructureData";

declare var jQuery: any;

@Component({
  selector: '[eventoForm]',
  templateUrl: './evento-form.html',
  styleUrls: ['./evento.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventoForm {

  @Output() showMsjEmitter: EventEmitter<string> = new EventEmitter();
  @Output() backFunctionEmitter: EventEmitter<string> = new EventEmitter();

  private patternInput: string = '[a-zA-z 0-9]*';

  private dataId: number = 0;
  private versionNum: number = 0;
  private dataContent: any = {};
  private viewConfig: any = [];

  private fieldsMap: any = {};
  private viewTitle: string = "";

  private currentEvento: Eventos = new Eventos();

  private fechaInicialOpts: any = {};

  private fechaFinalOpts: any = {};

  private popOverControl: boolean = false;

  // ********** PopOver Msjs ************ //
  private nombreMsjPopover: string = '';

  constructor(private route: ActivatedRoute, private dc: ChangeDetectorRef,
              private structureService: StructureService,
              private router: Router,
              private eventoService: EventoService,
              private etService: EtiquetaService,
              private utilService: UtilService) {
  }

  ngOnInit() {
    this.utilService.loadDateFormat(jQuery);
    this.dataId = this.route.snapshot.params['dataId'] || 0;
    this.versionNum = this.route.snapshot.params['versionNum'] || 0;
    this.startEvento();
    this.getView();
  }

  startEvento() {
    // this.currentEvento = new Eventos();
    this.currentEvento.fechaInicial = new Date();
    this.currentEvento.fechaFinal = null;
    this.currentEvento.activo = true;
    this.fechaInicialOpts = this.utilService.loadDateOptions(this.currentEvento.fechaInicial, this.currentEvento.fechaFinal);
    this.fechaFinalOpts = this.utilService.loadDateOptions(this.currentEvento.fechaInicial, null);
  }

  ngAfterContentInit() {
    jQuery('[data-toggle="popover"]').popover({
      placement: 'right',
      animation: true,
      template: this.utilService.getPopoverCustomTemplate('btn-danger')
    });
  }

  getView() {
    this.structureService.getViewByAppId(1, 1).then(
      data => {
        this.dataContent = data;
        this.viewConfig = this.dataContent.viewConfig || [];

        //armado de mapa a partir de campos
        var result = this.viewConfig.reduce(function (map, obj) {
          map[obj.htmlId] = obj;
          return map;
        }, {});
        //asignado a variable de instancia
        this.fieldsMap = result;
        this.viewTitle = this.dataContent.viewTitle;
      }
    );
  }

  saveEvento() {
    this.popOverControl = true;
    var execute: boolean = true;
    if (this.currentEvento.nombre == null || this.currentEvento.nombre.length == 0){
      this.nombreMsjPopover = 'Campo Requerido';
      jQuery('#eventoName').popover('show');
      execute = false;
    }
    if (this.currentEvento.fechaInicial == null){
      jQuery('#fechaInicial').popover('show');
      execute = false;
    }
    if (this.currentEvento.fechaFinal == null){
      jQuery('#fechaFinal').popover('show');
      execute = false;
    }
    if (execute == true){
      this.currentEvento.usuarioCreadorId = 1;
      this.currentEvento.usuariosID = 1;
      this.currentEvento.usuarioModificadorId = 1;

      let structureData: StructureData = new StructureData();
      structureData.description = this.currentEvento.nombre;
      structureData.active = this.currentEvento.activo;
      structureData.appId = 1;

      let addModel: AddEventoModel = new AddEventoModel();
      addModel.structureData = structureData;
      addModel.eventos = this.currentEvento;

      this.structureService.addEvent(addModel).subscribe(
        data => {
          this.showMsjEmitter.emit("Guardado");
          this.backFunctionEmitter.emit('mailList');
        },
        error => {
          console.log(error);
          if (!(error._body instanceof ProgressEvent)) {
            let tm1: string[] = error._body.split(',');
            let tm2: string[] = tm1[4].split(':');
            this.showMsjEmitter.emit(tm2[0]);
          }
        }
      );
    }
  }

  onKeypressName(event: KeyboardEvent){
    var temp: RegExpMatchArray = this.currentEvento.nombre.match('[a-zA-Z 0-9]*');
    if (temp[0].length < this.currentEvento.nombre.length){
     // jQuery('#eventoName').popover('show');
      this.currentEvento.nombre = this.currentEvento.nombre.slice(0, -1);
    }
  }

  onNameChange(){
    if (this.currentEvento.nombre.length > 0){
      jQuery('#eventoName').popover('hide');
    }else{
      jQuery('#eventoName').popover('show');
    }
  }

  onFechaInicialChange(){
    if (this.currentEvento.fechaInicial == null){
      jQuery('#fechaInicial').popover('show');
    }else{
      jQuery('#fechaInicial').popover('hide');
      this.currentEvento.fechaInicial.setHours(0,0,0,0);
      if (this.currentEvento.fechaFinal != null){
        this.currentEvento.fechaFinal.setHours(0,0,0,0);
        if (this.currentEvento.fechaInicial.getTime() > this.currentEvento.fechaFinal.getTime()){
          this.currentEvento.fechaFinal = null;
        }
      }
      this.fechaFinalOpts = this.utilService.loadDateOptions(this.currentEvento.fechaInicial, null);
    }
    this.dc.detectChanges();
  }

  onFechaFinalChange(){
    if (this.currentEvento.fechaFinal == null && this.popOverControl == true){
      jQuery('#fechaFinal').popover('show');
    }else {
      jQuery('#fechaFinal').popover('hide');
     // this.fechaInicialOpts = this.utilService.loadDateOptions(new Date(), this.currentEvento.fechaFinal);
    }
    this.dc.detectChanges();
  }

  isShow(variable): number {
    if (this.fieldsMap.hasOwnProperty(variable)) {
      return 1;
    } else {
      return 0;
    }
  }
}
