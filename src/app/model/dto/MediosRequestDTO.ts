
/**
* Created by Jose Gonzalez
* 15 / 01 / 2017
*/

import {EspaciosRequestDTO} from "./EspaciosRequestDTO";

export class MediosRequestDTO {
  tipoMediosId : number;
  tipoMediosStr : string;

  zonasId : number;
  zonasStr : string;

  fechaInicial : Date;
  fechaFinal : Date;
  fechaInicialTime : number;
  fechaFinalTime : number;

  eventosId : number;

  description : string;

  mediosId : number;

  espacios : EspaciosRequestDTO[] = [];
}
