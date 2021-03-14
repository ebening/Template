/**
 * Created by jdominguez on 2/4/17.
 */


import {Injectable} from "@angular/core";
import {UtilService} from "../util.service";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";
import {Usuarios} from "../../model/Usuarios";
import {UdpMediosUpsMerza} from "../../model/sp/UdpMediosUpsMerza";

@Injectable()
export class UdpMediosEspaciosService {

  private spControllerURL: string = "rest/udpMediosEspacios/";

  constructor(private http: Http, private util: UtilService){}

  getEspaciosPromocionalByMecanica(model): Observable<Response>{
    let fullUrl: string = this.util.url + this.spControllerURL + "mediosUbicacionesMecanicas";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  getTipoMedioByMecanica(model): Observable<Response>{
    let fullUrl: string = this.util.url + this.spControllerURL + "tiposMediosByMecanica";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  guardarTodoMZ(model: UdpMediosUpsMerza[]){
    let fullUrl: string = this.util.url + this.spControllerURL + "saveMZ";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  getIndicadoresMediosOfertas(model){
    let fullUrl: string = this.util.url + this.spControllerURL + "indicadores";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  guardarTodoAlSuper(model){
    let fullUrl: string = this.util.url + this.spControllerURL + "saveALS";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  selectEspaciosProductos (model): Observable<Response>{
    let fullUrl: string = this.util.url + this.spControllerURL + "selectEspaciosProductos";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  copyMecanicasSel (model): Observable<Response>{
    let fullUrl: string = this.util.url + this.spControllerURL + "copyMecanicasSel";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  copyMecanicasVal (model): Observable<Response>{
    let fullUrl: string = this.util.url + this.spControllerURL + "copyMecanicasVal";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  selectMediosEspacios (eventosId: number): Observable<Response>{
    let user: Usuarios = this.util.getUsuarioLogged();
    let model = {
      eventosId: eventosId,
      usuariosId: user.usuariosId
    }
    let fullUrl: string = this.util.url + this.spControllerURL + "selectMediosEspacios";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

  selectEspaciosCategorias(mediosId: number, statusId: number, usuariosId: number): Observable<Response>{
    let model = {
      mediosId: mediosId,
      statusId: statusId,
      usuariosId: usuariosId
    };
    let fullUrl: string = this.util.url + this.spControllerURL + "selectEspaciosCategorias";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }
}
