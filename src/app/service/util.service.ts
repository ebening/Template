/**
 * Created by jdominguez on 12/27/16.
 */

import {Injectable} from "@angular/core";
import {Usuarios} from "../model/Usuarios";
import {Headers} from "@angular/http";


@Injectable()
export class UtilService {
  /* Cambiar Por URL Back */
  public url: string = "http://localhost:8080/";

  // URL DEMO ADINFI CLOUD
  // public url: string = "http://104.168.149.237:1501/";

  public empresaSelect: string = '0';
  public urlList: any = {
    alsuper: "http://localhost:8080/",
    merza: "http://localhost:8081/"
  };

  public appId: number = 1;

  /**
   * IDLE Configuration
   */
  public idleWait: number = 600;
  public idleTimeOutMsj: number = 15;

  /**
   * DateTime Global Configurations
   * @type {{autoclose: boolean; daysOfWeekHighlighted: [number,number]; format: string; language: string; todayHighlight: boolean; icon: string; placeholder: string; clearBtn: boolean}}
   */
  public datePickerOptions = {
    autoclose: true,
    startDate: new Date(),
   // daysOfWeekHighlighted: [2,4],
    format: 'dd/mm/yyyy',
    language: 'es_MX',
    todayHighlight: true,
    icon: 'fa fa-calendar',
    placeholder: 'Elige Fecha',
    clearBtn: true,
  };

  /**
   * Parsley Messages Global Configuration
   * @type {{locale: string}}
   */
  public parsleyConfig = {
   locale: 'es'
  };

  getUsuarioLogged(): Usuarios {
    let users: Usuarios = JSON.parse(localStorage.getItem("logged"));
    return users;
  }


  getRequestHeaders(): Headers{
    let user : Usuarios = this.getUsuarioLogged();
    console.log(user);

    let userId = user.usuariosId;

    let headers : any = {};
    headers['Content-Type'] = 'application/json';
    headers['userid'] = userId;

    console.log(headers);
    return new Headers(headers);
  }

  changeBackEnd(option: string){
    let op: number = parseInt(option);
    switch (op){
      case 0: this.url = this.urlList.alsuper; break;
      case 1: this.url = this.urlList.merza; break;
    }
  }

  loadDateFormat(jQuery){
      jQuery.fn.datepicker.dates['en'] = {
      days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: "Hoy",
      clear: "Limpiar",
      format: "dd/MM/yyyy",
      titleFormat: "MM yyyy",
      weekStart: 0
    }
  }

  loadDateOptions(initialDate:Date, finalDate:Date){
    let test : any = {};
    test['startDate'] = initialDate;
    test['endDate'] = finalDate;
    test['todayHighlight'] = true;
    test['icon'] = 'fa fa-calendar';
    test['placeholder'] = 'Selecciona Fecha';
    test['autoclose'] = true;
    return test;
  }

  getMapFromArray(array, key){
    let map = array.reduce(function(map, element:any) {
        map[element[key]] = element;
        return map;
    }, {});
    return map;
  }

  getPopoverCustomTemplate(className) {
    return  '<div class="popover ' + className + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title">' +
          '</h3><div class="popover-content"></div></div>';
  }

  /**
   * Table Smart Settings
   */
  private settingsSmartTable = {
    columns: {},
    noDataMessage: 'No hay registros que mostrar',
    attr: {
      class: 'tableClassDemo'
    },
    actions: {
      columnTitle: '',
      position: 'left'
    },
    add: {
      addButtonContent: '<span class="fa fa-plus-circle fa-lg"></span>',
      createButtonContent: '<span class="fa fa-save fa-lg"></span>',
      cancelButtonContent: '<span class="fa fa-remove fa-lg"></span>'
    },
    edit: {
      editButtonContent: '<span class="fa fa-pencil fa-lg"></span>',
      saveButtonContent: '<span class="fa fa-save fa-lg"></span>',
      cancelButtonContent: '<span class="fa fa-remove fa-lg"></span>'
    },
    delete: {
      deleteButtonContent: '<span class="fa fa-remove fa-lg"></span>',
      confirmDelete: true
    }
  };

  getNewSmartTableSettings(){
    let newSettings = Object.assign({}, this.settingsSmartTable);
    return newSettings;
  }
}
