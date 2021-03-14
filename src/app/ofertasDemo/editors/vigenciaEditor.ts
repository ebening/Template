/**
 * Created by jdominguez on 2/16/17.
 */


import {Component, ElementRef, ViewChild, ChangeDetectorRef} from "@angular/core";
import {DefaultEditor} from "ng2-smart-table";
import {UtilService} from "../../service/util.service";

declare var jQuery: any;

@Component({
  template: '<datetime id="fechaInicial" style="width: 300px" #dateVigencia id="vigencia" (dateChange)="onFechaInicialChange()"  [timepicker]="false" [datepicker]="fechaInicialOpts" ' +
  '[(ngModel)]="fechaSelected" data-toggle="popover" data-content="Campo Requerido"></datetime><br>' +
  '<datetime id="fechaFinal" (dateChange)="onFechaFinalChange()" [timepicker]="false" [datepicker]="fechaInicialOpts" ' +
  '[(ngModel)]="endDate" data-toggle="popover" data-content="Campo Requerido"></datetime>',
})
export class VigenciaEditor extends DefaultEditor {

  @ViewChild('dateVigencia') dateElement: ElementRef;

  private popOverControl: boolean = false;

  private fechaSelected: Date = new Date();
  private endDate: Date = null;
  private fechaInicialOpts: any = {};
  private fechaFinalOpts: any = {};

  constructor(private utilService: UtilService, private dc: ChangeDetectorRef){
    super();
    this.fechaInicialOpts = this.utilService.loadDateOptions(new Date(), this.endDate);
    this.fechaFinalOpts = this.utilService.loadDateOptions(this.fechaSelected, null);
  }

  updateValue(): void{
    let tempStr: string = '';
    if (this.endDate != null){
      tempStr = 'Del ' + this.fechaSelected.getDate() + "/" + this.fechaSelected.getMonth() + "/" + this.fechaSelected.getFullYear() + ' Al ' +
        this.endDate.getDate() + '/' + this.endDate.getMonth() + '/' + this.endDate.getFullYear();
    }
    this.cell.newValue = tempStr;
  }

  onFechaInicialChange(){
    if (this.fechaSelected == null){
      jQuery('#fechaInicial').popover('show');
    }else{
      jQuery('#fechaInicial').popover('hide');
      this.fechaSelected.setHours(0,0,0,0);
      if (this.endDate != null){
        this.endDate.setHours(0,0,0,0);
        if (this.fechaSelected.getTime() > this.endDate.getTime()){
          this.endDate = null;
        }
      }
      this.fechaFinalOpts = this.utilService.loadDateOptions(this.fechaSelected, null);
    }
    this.updateValue();
    this.dc.detectChanges();
  }

  onFechaFinalChange(){
    if (this.endDate == null && this.popOverControl == true){
      jQuery('#fechaFinal').popover('show');
    }else {
      jQuery('#fechaFinal').popover('hide');
    }
    this.updateValue();
    this.dc.detectChanges();
  }
}
