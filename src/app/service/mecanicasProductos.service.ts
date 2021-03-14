/**
 * Created by jdominguez on 2/11/17.
 */


import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {UtilService} from "./util.service";
import {Observable} from "rxjs";
@Injectable()
export class MecanicasProdService {

  private rootUrl: string = 'rest/mecanicasProductos/';

  constructor(private http: Http, private util: UtilService){}

  getMecanicasByMedioId (model): Observable<Response>{
    let fullUrl: string = this.util.url + this.rootUrl + "listByMedio";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullUrl, JSON.stringify(model), {headers: headers});
  }

}
