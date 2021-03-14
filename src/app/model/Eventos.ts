
/**
* Created by Jorge Dominguez with Custom Angular Model Generator v1.0
* 15 / 01 / 2017
*/

import {Tipoeventos} from "./Tipoeventos";

export class Eventos {

  public eventosId: number = 0;
  public activo: boolean = true;
  public fechaCreacion: Date = new Date();

  public fechaFinal: Date = new Date();
  public fechaInicial: Date = new Date();
  public fechaModificacion: Date = new Date();
  public fechaModificacionStatus: Date = new Date();
  public horaFinal: Date = new Date();
  public horaInicial: Date = new Date();
  public ingresosPopReal: number = 0;
  public nombre: string = '';
  public periodosId: number;
  public programasId: number;
  public statusId: number;
  public tag1: string = '';
  public tag2: string = '';
  public tag3: string = '';
  public usuarioCreadorId: number;
  public usuarioModificadorId: number;
  public usuariosID: number;
  public tipoEventos: Tipoeventos = null;
  public numeroEvento: string = '';

  public fechaInicialStr : string;
  public fechaFinalStr : string;

  public fechaInicialTime : number;
  public fechaFinalTime : number;

}
