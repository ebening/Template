/**
 * Created by jdominguez on 2/11/17.
 */

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Response, Headers, Http} from "@angular/http";
import {UtilService} from "./util.service";
@Injectable()
export class EspaciosUbicacionesService {

  private rootUrl: string = 'rest/espaciosUbicaciones/';

  constructor(private util: UtilService, private http: Http){}

  public getList(): Observable<Response>{
    let finalUrl: string = this.util.url + this.rootUrl + "list";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(finalUrl, headers);
  }
}
