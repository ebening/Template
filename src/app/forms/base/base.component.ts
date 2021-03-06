import { Component, ViewEncapsulation, AfterViewInit,ViewContainerRef  } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

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

declare var jQuery: any;

@Component({
  selector: '[base]',
  template: `<div></div>`
})

export class Base {

  /*----------------------------------------------------------------------------------------------------*/
  am : any = {};
  /*----------------------------------------------------------------------------------------------------*/
  structureDataId : number = 0;
  versionNum : number = 0;
  eventoData : Eventos = new Eventos();
  structureService: StructureService;
  router: Router;

  constructor(
    structureService : StructureService, 
    router: Router){
      this.structureService = structureService;
      this.router = router;
      this.buildDefaultActionsMap();
  }

  returnMethod(){
    alert("return metodo base");
  }

  buildBase(structureDataId, versionNum, eventoData){
    this.structureDataId = structureDataId;
    this.versionNum = versionNum;
    this.eventoData = eventoData;
  }

  finishMethod(){
    let requestData : any = {};
    requestData.dataId = this.structureDataId;
    requestData.versionNum = this.versionNum;
    requestData.valueCode = "SIGUIENTE";
    requestData.eventosId = this.eventoData.eventosId;

    this.structureService.genericSave(requestData).then(
      response => {
        if(response.status == 200 ){
          this.router.navigateByUrl('app');
        }
      },
      error =>{
          alert('Error al finalizar captura');
      }
    );
  }

  ngOnInit(): void {
    this.buildDefaultActionsMap();
  }

  buildDefaultActionsMap(){
    let defaultActionsMap = {};
    defaultActionsMap['return-btn'] = 'returnMethod';
    defaultActionsMap['finish-btn'] = 'finishMethod';
    this.am = defaultActionsMap;
  }

  getButtonAction(key:string, map:{}):string{

      console.log("accion: " + key);
      if(map[key] === undefined){
        console.log(this.am);
        let x = this.am[key];
        console.log(x);
        return x;
      }else{
        return map[key].defaultMethod;
      }
  }
}
