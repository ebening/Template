
/**
* Created by Jose Gonzalez
* 15 / 01 / 2017
*/

export class ExcelErrorDTO {
  public fila:string;
  public columna:string;
  public campo:string;
  public descripcionError:string;
  public pestaña:string;

  load(pestaña:string, fila:string, columna:string, campo:string, descripcionError:string){
    this.fila = fila;
    this.columna = columna;
    this.campo = campo;
    this.descripcionError = descripcionError;
    this.pestaña = pestaña;
  }

  getMsg():string{
    return 'Pestaña: '+this.pestaña+". Campo: "+this.campo+". Celda: "+ this.fila + this.columna + ". Error: " + this.descripcionError;
  }
}
