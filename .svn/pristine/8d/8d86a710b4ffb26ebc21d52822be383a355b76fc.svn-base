/**
 * Created by jdominguez on 1/4/17.
 */

import {Injectable} from "@angular/core";
import {UtilService} from "./util.service";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
@Injectable()

export class UserService {

  constructor(private http: Http, private util: UtilService){}

  changePassword(model): any {
    let fullPath: string = this.util.url + "rest/users/chpwd";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullPath, JSON.stringify(model) ,{headers: headers});
  }

}
