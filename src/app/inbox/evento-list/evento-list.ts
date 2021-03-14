/**
 * Created by jdominguez on 1/21/17.
 */


import {Component, ChangeDetectorRef} from "@angular/core";
import {StructureService} from "../../service/structure.service";
import {EtiquetaService} from "../../service/etiquetas.service";
import {UtilService} from "../../service/util.service";
import {Router} from "@angular/router";

@Component({
  selector: '[eventoList]',
  templateUrl: './evento-list.html',
  styleUrls: ['./evento-list.style.scss']
})
export class EventoList {


  private data: any = [];

  private canCreateNewRequest : Boolean = true;

  constructor(
    private structureService: StructureService,
    private cd: ChangeDetectorRef,
    private etService: EtiquetaService,
    private util: UtilService,
    private router: Router
  ){}

  ngOnInit(){
    this.initData();
  }

  initData(){
    console.log("Cargando Eventos");
    this.structureService.getInbox().then(
      data => {
        this.data = data;
        this.cd.detectChanges();
      }
    );
    this.structureService.hasUserRequestCreationProfile().then(
      data => {
        console.log("seteando valor");
        this.canCreateNewRequest = data;
        console.log(this.canCreateNewRequest);
        if(!this.canCreateNewRequest){
          console.log("ocultando boton");
          jQuery(document).find('#compose-btn').hide(); 
        }
      }
    );
  }

  handleChangeEmpresa(event): void {
    this.data = [];
    this.util.changeBackEnd(event);
    this.etService.updateEtiquetas();
    this.initData();
   // this.router.navigateByUrl('#');
  }

  getInbox(dataId, viewId){

  }

}
