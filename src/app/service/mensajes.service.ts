/**
 * Created by jdominguez on 2/6/17.
 */


import {Injectable} from "@angular/core";
import {UtilService} from "./util.service";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
@Injectable()
export class MensajeService {

  private appControllerUrl: string = 'rest/mensajes/';

  constructor(private http: Http, private util: UtilService){}

  getMsjByKey(key: string): Observable<Response>{
    let finalUrl: string = this.util.url + this.appControllerUrl + "getMsjByKey";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(finalUrl, JSON.stringify(key), headers);
  }
}
