
/**
* Created by Jose Gonzalez
* 15 / 01 / 2017
*/

export class SpaceModel {

  /*pantalla dos*/
  public paginasId : number;
  public espaciosId : number;
  public categoriasId : number;
  public subCategoriasId : number;

  public paginas : any;
  public espacios : any;
  public categorias : any;
  public subCategorias : any;

  public copyKey(e:SpaceModel){
    this.paginasId = e.paginasId;
    this.categoriasId = e.categoriasId;
    this.subCategoriasId = e.subCategoriasId;
  }

  public setEspaciosId(e:number){
    this.espaciosId = e;
  }

  equalsByKey(e:SpaceModel){
    if(this.paginasId === e.paginasId && 
       this.categoriasId == e.categoriasId && 
       this.subCategoriasId == e.subCategoriasId){
      return true;
    }else{
      return false;
    }
  }

  equalsByPage(e:SpaceModel){
    if(this.paginasId === e.paginasId){
      return true;
    }else{
      return false;
    }
  } 

  equals(e:SpaceModel){
    if(this.paginasId === e.paginasId && 
       this.categoriasId == e.categoriasId && 
       this.subCategoriasId == e.subCategoriasId &&
       this.espaciosId == e.espaciosId){
      return true;
    }else{
      return false;
    }
  }
}
