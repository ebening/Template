/**
 * Created by jgonzalez on 15/01/17.
 */

import { Injectable } from '@angular/core';
import {Response, Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import {UtilService} from "./util.service";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";

@Injectable()
export class CatalogService {

    constructor(
        private util: UtilService,
        private http: Http){

    }

    /*Funcion para obtener todos los Tipo de Medios*/
    getTipoMedios(){
        return this.getCatalogByCatalogName('tipoMedios');
    }
    getTipoMediosById(id:number){
        return this.getCatalogByCatalogNameAndId('tipoMedios',id);
    }

    /*Funcion para obtener las descripciones de combo*/
    getDescripcionesCombo(){
        return this.getCatalogByCatalogName('descripcionesCombo');
    }

    getCombos(){
        return this.getCatalogByCatalogName('combos');
    }

    /*Funcion para obtener las descripciones de promocion*/
    getDescripcionesPromocion(){
        return this.getCatalogByCatalogName('descripcionesPromocion');
    }
    
    getPromociones(){
        return this.getCatalogByCatalogName('mecanicas/nombres');
    }

    /*Funcion para obtener todas las categorias*/
    getCategorias(){
        return this.getCatalogByCatalogName('categorias');
    }
    /*Funcion para obtener todas las subCategorias*/
    getSubCategorias(){
        return this.getCatalogByCatalogName('subCategoria');
    }
    /*Funcion para obtener todas las marcas*/
    getMarcas(){
        return this.getCatalogByCatalogName('marcas');
    }
    /*Funcion para obtener todos los modelos*/
    getModelos(){
        return this.getCatalogByCatalogName('modelos');
    }
    /*Funcion para obtener todos las presentaciones*/
    getPresentaciones(){
        return this.getCatalogByCatalogName('presentaciones');
    }

    /*Funcion para obtener todos los productos*/
    getProductos(){
        return this.getCatalogByCatalogName('productos');
    }

     getProductosByProperties(request: {}){
        return this.getCatalogByCatalogName('productos');
    }

    getSubCategoriasByCategoriasId(id : number){
        return this.getCatalogByQueryAndId('subCategoria','findByCategoriasId',id);
    }

    getSubCategoriasByCategoriasIdSubscribe(id : number){
        return this.getCatalogByQueryAndIdSubscribe('subCategoria','findByCategoriasId',id);
    }

    /*Funcion para obtener todas las zonas*/
    getZonas(){
        return this.getCatalogByCatalogName('zonas');
    }
    /*Funcion para obtener todos los espacios promocionales*/
    getEspaciosPromocionales(){
        return this.getCatalogByCatalogName('espaciosPromocionales');
    }

    /*funcion generica findAll catalogos*/
    getCatalogByCatalogName(catalogName : string){
        let finalUrl : string = `${this.util.url}${catalogName}/`;
        let headers = new Headers({'Content-Type': 'application/json'});
         return this.http.get(finalUrl).toPromise()
        .then(data => data.json() )
        .catch(this.error);
    }

    /*fucnion para obtener un catalogo en base a un filtro especifico*/
    getCatalogByQueryAndId(catalogName:string, query:string, id:number){
        let finalUrl : string = `${this.util.url}${catalogName}/${query}/${id}`;
        let headers = new Headers({'Content-Type': 'application/json'});
         return this.http.get(finalUrl).toPromise()
        .then(data => data.json() )
        .catch(this.error);
    }

    /*Funcion para actualizar un medio(encabezado)*/
    getCatalogByQueryAndIdSubscribe(catalogName:string, query:string, id:number): Observable<Response> {
        let finalUrl : string = `${this.util.url}${catalogName}/${query}/${id}`;
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(finalUrl);
  }

    /*funcion generica findById catalogos*/
    getCatalogByCatalogNameAndId(catalogName : string, id: number){
        let finalUrl : string = `${this.util.url}${catalogName}/${id}`;
        let headers = new Headers({'Content-Type': 'application/json'});
         return this.http.get(finalUrl).toPromise()
        .then(data => data.json() )
        .catch(this.error);
    }

    getCategoriaById(id: number): Observable<Response>{
      let finalUrl: string = this.util.url + 'categorias/byId';
      let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
      return this.http.post(finalUrl, id, headers);
    }

    getCategoriaByName(name: string): Observable<Response>{
      let finalUrl: string = this.util.url + 'categorias/byName';
      let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
      return this.http.post(finalUrl, name, headers);
    }

    getSubCategoriaById(id: number): Observable<Response>{
      let finalUrl: string = this.util.url + 'subCategoria/byId';
      let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
      return this.http.post(finalUrl, id, headers);
    }

    getSubCategoriaByName(name: string): Observable<Response> {
      let finalUrl: string = this.util.url + 'subCategoria/byName';
      let headers = new Headers({'Content-Type': 'application/json','Authorization':'Bearer ' + localStorage.getItem("token")});
      return this.http.post(finalUrl, name, headers);
    }

    error(error: any){
        return Promise.reject(error.message || error);
    }
}
