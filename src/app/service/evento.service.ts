/**
 * Created by jdominguez on 1/15/17.
 */


import {Injectable} from "@angular/core";
import {UtilService} from "./util.service";
import {Http, Response, Headers} from "@angular/http";
import {Eventos} from "../model/Eventos";
import {Observable} from "rxjs";
@Injectable()
export class EventoService {

  private eventoControllerUrl = 'rest/evento/';

  constructor(private http: Http, private util: UtilService){

  }

  save(evento: Eventos): Observable<Response>{
    let url:string  = this.util.url + this.eventoControllerUrl + 'add';
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(url, JSON.stringify(evento), {headers: headers});
  }


}
