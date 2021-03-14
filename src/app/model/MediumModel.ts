
/**
* Created by Jose Gonzalez
* 15 / 01 / 2017
*/

import {SpaceModel} from "./SpaceModel";

export class MediumModel {

  public mediosId : number;
  public numeroHerramienta : string;
  public nombreHerramienta : string;
  
  public tipoMediosId : number;
  public zonasId : number;
  public fechaInicial : Date;
  public fechaFinal : Date;

  /*pantalla dos*/
  public paginasId : number;
  public espaciosId : number;
  public categoriasId : number;
  public subCategoriasId : number;

  public espacios : SpaceModel[] = [];
  public espaciosKeys : SpaceModel[] = [];

  public limpiarEspacios(){
    this.espaciosKeys = [];
    this.espacios = [];
  }


  //funcion para saber cuantos espacios tiene una llave actual
  public getCurrentSpaces(e:SpaceModel){
    let tmp : SpaceModel[] = [];
    for(let s of this.espacios){
      if(s.equalsByKey(e)){
        tmp.push(s);
      }
    }
    return tmp.length;
  }

  //funcion para saber cuantos espacios tiene una llave actual
  public getCurrentSpacesByPage(e:SpaceModel){
    let tmp : SpaceModel[] = [];
    for(let s of this.espacios){
      if(s.equalsByPage(e)){
        tmp.push(s);
      }
    }
    return tmp.length;
  }

  //funcion para borrar el detalle de un registro para despues recargar con la nueva cantidad de espacios
  public dropSpace(e:SpaceModel){
    let tmp : SpaceModel[] = [];
    for(let s of this.espacios){
      if(!s.equalsByKey(e)){
        tmp.push(s);
      }
    }
    this.espacios = tmp;
  }

  public dropSpaceByPage(e:SpaceModel){
    let tmp : SpaceModel[] = [];
    for(let s of this.espacios){
      if(!s.equalsByPage(e)){
        tmp.push(s);
      }
    }
    this.espacios = tmp;
  }


  //funcion para agregar la llave nueva
  public addSpaceKey(e:SpaceModel){
    this.espaciosKeys.push(e);
  }

  existsCurrentSpaceOnKeys(e:SpaceModel){
    let exists = false;
    console.log("valor de llaves");
    console.log(this.espaciosKeys);
    this.espaciosKeys = this.espaciosKeys || [];
    for(let space of this.espaciosKeys){
      if(space.equalsByKey(e)){
        exists = true;
        break;
      }
    }
    return exists;
  }

  getSpaceModelFromForm(){
    let spaceModel : SpaceModel = new SpaceModel();
    spaceModel.paginasId = this.paginasId;
    spaceModel.espaciosId = this.espaciosId;
    spaceModel.categoriasId = this.categoriasId;
    spaceModel.subCategoriasId = this.subCategoriasId;
    return spaceModel;
  }

  getSpaceModel(espaciosId:number){
    let spaceModel : SpaceModel = new SpaceModel();
    spaceModel.paginasId = this.paginasId;
    spaceModel.espaciosId = espaciosId;
    spaceModel.categoriasId = this.categoriasId;
    spaceModel.subCategoriasId = this.subCategoriasId;
    return spaceModel;
  }

  copyFromBase(e : MediumModel){
    this.numeroHerramienta = e.numeroHerramienta;
    this.nombreHerramienta = e.nombreHerramienta;
    this.tipoMediosId = e.tipoMediosId;
    this.zonasId = e.zonasId;
    this.mediosId = e.mediosId;
    this.fechaInicial = e.fechaInicial;
    this.fechaFinal = e.fechaFinal;

    this.espacios = e.espacios;
    this.espaciosKeys = e.espaciosKeys;
  }

    //funcion para reorganizar por pagina
  resortPerPage(){
    let pages : any = {};
    for(let k of this.espaciosKeys){
      if(pages[k.paginasId] == undefined){
        pages[k.paginasId] = 0;
      }
    }
    
    for(let s of this.espacios){
      let currentSpace = pages[s.paginasId] + 1;
      s.espaciosId = currentSpace;
      pages[s.paginasId] = currentSpace;
    }
    console.log(this.espacios);
  }

  borrarEspacio(espacio:SpaceModel){
    let newList : SpaceModel[] = [];
    for(let s of this.espacios){
      if(!s.equals(espacio)){
        newList.push(s);
      }
    }
    this.espacios = newList;
    this.resortPerPage();
  }

  rebuildSpacesKeys(){
    for(let s of this.espacios){
       if(!this.existsCurrentSpaceOnKeys(s)){
         this.addSpaceKey(s);
       }
    }
  }
}
