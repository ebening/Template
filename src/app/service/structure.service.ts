/**
 * Created by jdominguez on 12/27/16.
 */

import {Injectable} from '@angular/core';
import {Response, Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import {UtilService} from "./util.service";
import {AddEventoModel} from "../model/AddEventoModel";

import {MediosRequestDTO} from "../model/dto/MediosRequestDTO";
import {MediosTableDTO} from "../model/helper/MediosTableDTO";

@Injectable()
export class StructureService {

  private appControllerUrl: string = 'rest/appController/';

  constructor(private util: UtilService,
              private http: Http) {
  }

  getWorkFlow(model): Observable<Response> {
    let finalUrl: string = this.util.url + this.appControllerUrl + "worflow";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(model), {headers: headers});
  }

  getInbox() {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "StructureData/";
    let headers : Headers  = this.util.getRequestHeaders();
    return this.http.get(finalUrl,{headers: headers}).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  //ejecuta el query de validacion y retorna el resultado
  getCatalogExcelValidationResult(q:string){
    let finalUrl: string = this.util.url + this.appControllerUrl +  "getCatalogExcelValidationResult/";
    let body:any = {};
    body['q'] = q;
    let headers : Headers  = this.util.getRequestHeaders();
    return this.http.post(finalUrl, body, {headers: headers}).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  hasUserRequestCreationProfile(){
    let finalUrl: string = this.util.url + this.appControllerUrl +  "hasUserRequestCreationProfile/";
    let headers : Headers  = this.util.getRequestHeaders();
    return this.http.get(finalUrl,{headers: headers}).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  getApps() {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "Apps/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl, headers).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  addEvent(data: AddEventoModel): Observable<Response> {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "StructureData/";
    let headers = new Headers({'Content-Type': 'application/json'});
  //  return this.http.post(finalUrl, JSON.stringify(data), {headers: headers}).toPromise()
  //    .then().catch(this.error);
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers});
  }

  //metodo para guardar
  save(data) {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "Transition/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers}).toPromise()
      .then().catch(this.error);
  }
  //metodo para guardar y finalizar capturas en medios
  saveMedium(data) {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "Transition/Medium/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers}).toPromise()
      .then().catch(this.error);
  }

  //metodo para guardar y finalizar capturas en ofertas
  saveOffer(data) {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "Transition/Offer/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers}).toPromise()
      .then().catch(this.error);
  }

  //metodo para guardar y finalizar capturas en ofertas
  genericSave(data) {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "Transition/save/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers}).toPromise()
      .then().catch(this.error);
  }


  getView(dataId, viewId) {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "showView/" + dataId + "/" + viewId;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  getViewByAppId(appId, viewId){
    let finalUrl: string = this.util.url + this.appControllerUrl +  "showViewByApp/" + appId + "/" + viewId;
    let headers = new Headers({'Authorization':'Bearer ' + localStorage.getItem("token"), 'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
      .then(data => data.json())
      .catch(this.error);
  }

  getViewObserver(dataId, viewId): Observable<Response> {
    let finalUrl: string = this.util.url + this.appControllerUrl +  "showForm/" + dataId + "/" + viewId;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl, {headers: headers});
  }

  error(error: any) {
    return Promise.reject(error.message || error);
  }

  /*Funcion para obtener el evento en base a la estructura*/
  getEventoByStructureDataId(structureDataId : number){
     let finalUrl : string = `${this.util.url}/eventos/findByStructureDataId/${structureDataId}`;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
    .then(data => data.json() )
    .catch(this.error);
  }

  /*Funcion para borrar un medio(encabezado)*/
  borrarMedios(mediosId : number): Observable<Response> {
    let finalUrl: string = this.util.url + "medios/"+mediosId;
    let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
    return this.http.delete(finalUrl, {headers: headers});
  }

  /*Funcion para actualizar un medio(encabezado)*/
  actualizarMedios(mediosId : number, data: MediosRequestDTO): Observable<Response> {
    let finalUrl: string = this.util.url + "/medios/"+mediosId;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers});
  }

  /*Funcion para guardar un medio(encabezado)*/
  guardarMedios(data: MediosRequestDTO): Observable<Response> {
    let finalUrl: string = this.util.url + "/medios/";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(finalUrl, JSON.stringify(data), {headers: headers});
  }

  /*Funcion para obtener los medios de un evento*/
  getMediosByEventoId(eventosId : number){
    let finalUrl : string = `${this.util.url}medios/findByEventosId/${eventosId}`;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
    .then(data => data.json() )
    .catch(this.error);
  }

  /*Funcion para obtener los medios de un evento paginados*/
  getMediosByEventoIdAndPagination(eventosId : number, table : MediosTableDTO){
    let finalUrl : string = `${this.util.url}medios/findByEventosId/${eventosId}${table.getPaginationString()}`;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
    .then(data => data.json() )
    .catch(this.error);
  }

  /*Funcion para buscar los medios de un evento por nombre paginados*/
  findMediosByEventoIdAndNameAndPagination(eventosId : number,  text: string, table : MediosTableDTO){
    let finalUrl : string = `${this.util.url}medios/findByEventosIdAndName/${eventosId}/${text}${table.getPaginationString()}`;
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(finalUrl).toPromise()
    .then(data => data.json() )
    .catch(this.error);
  }
}
