import {Usuarioscategorias} from "./Usuarioscategorias";
/**
* Created by Jorge Dominguez with Custom Angular Model Generator v1.0
* 26 / 01 / 2017
*/

export class Usuarios {

  public usuariosId: number;
  public usuariosid: number;
  
  public usuario: string;
  public password: string;
  public nombre: string;
  public apellidoMaterno: string;
  public apellidoPaterno: string;
  public direccion: string;
  public correo: string;
  public activo: boolean;
  public fechaCreacion: Date;
  public fechaModificacion: Date;
  public usuariosIdjefe: number;
  public usuarioCreadorid: number;
  public usuarioModificadorid: number;
  public nivel1: boolean;
  public cambioPassword: boolean;
  public sesion: boolean;
  public usuariosCategorias: Usuarioscategorias[] = [];
}
