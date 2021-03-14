/**
 * Created by jdominguez on 11/16/16.
 */
import {Injectable} from "@angular/core";
import {UtilService} from "./util.service";
import {Http, Headers} from "@angular/http";
import {EtiquetasDTO} from "../model/dto/EtiquetasDTO";


@Injectable()
export class EtiquetaService {

  private appControllerUrl: string = 'rest/appController/';
  private etiquetas: EtiquetasDTO = new EtiquetasDTO();

  // ********** BUTTONS ************** //

  constructor(private http: Http, private util: UtilService){}

  ngOnInit(){
    this.updateEtiquetas();
  }

  updateEtiquetas(){
    let finalUrl: string = this.util.url + this.appControllerUrl + "etiquetas";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    this.http.post(finalUrl, {headers: headers}).subscribe(
      data => {
        this.etiquetas = JSON.parse(JSON.parse(JSON.stringify(data))._body) as EtiquetasDTO;
      },
      error => {

      }
    );
  }
}
