/**
 * Created by jdominguez on 1/4/17.
 */

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Response, Headers, Http} from "@angular/http";
import {UtilService} from "./util.service";
import {Usuarios} from "../model/Usuarios";
@Injectable()

export class LoginService {

  constructor(private http: Http, private util: UtilService){}

  public getIdleConfig(): Observable<Response> {
    let fullPath: string = this.util.url + "rest/params/idle";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullPath, {headers: headers});
  }

  public login (model): Observable<Response> {
    let tokenUrl = this.util.url + "public/login";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers});
  }

  public resetPwd(username: string): any {
    let fullPath: string = this.util.url + "public/resetpwd";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(fullPath, JSON.stringify(username) ,{headers: headers});
  }

  public getLoggedUser(username: string): Observable<Response> {
    let fullPath: string = this.util.url + "rest/users/byusername";
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullPath, JSON.stringify(username) ,{headers: headers});
  }

  logout(): Observable<Response>{
    let users: Usuarios = JSON.parse(localStorage.getItem("logged"));
    let fullPath: string = this.util.url + "rest/users/logout";
    let headers = new Headers({'Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.post(fullPath, JSON.stringify(users.usuario) ,{headers: headers});
  }

  checkLogin(){
    if (localStorage.getItem("logged") != null &&
      localStorage.getItem("token") != null &&
      localStorage.getItem("token") != ''){
      return true;
    }else{
      return false;
    }
  }
}
