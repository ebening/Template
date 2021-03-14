import {Component, ViewEncapsulation, style, animate, transition, trigger, ViewChild} from '@angular/core';
import {LoginService} from "../service/login.service";
import {Usuarios} from "../model/Usuarios";
import {Router} from "@angular/router";
import {Md5} from "ts-md5/dist/md5";
import {EtiquetaService} from "../service/etiquetas.service";
import {Observable} from "rxjs";
import {Modal} from "ng2-modal";
import {UserService} from "../service/user.service";
import {UtilService} from "../service/util.service";
import {Parametros} from "../model/Parametros";

declare var jQuery: any;


@Component({
  selector: 'login',
  styleUrls: [ './login.style.scss' ],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'login-page app'
  },
  animations: [
    trigger(
      'msjShow', [
        transition('void => *', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition('* => void', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ]
})
export class Login {

  // ************** Mensajes ********** //
  private hasMsj: boolean = false;
  private mensajeAlert: string = '';
  private classMsjInfo: boolean = false;
  private classMsjDanger: boolean = true;

  // ************ Mensajes ChPwd ********* //
  private msjChPwd: boolean = false;

  // ************* Modal ************ //
  @ViewChild('modalChPwd') modal: Modal;

  private model = {
    username: '',
    pwd: ''
  };

  private confirmPwd: string;

  private enableBtn: boolean = true;

  constructor(
    private loginService: LoginService,
    private etService: EtiquetaService,
    private userService: UserService,
    private utilService: UtilService,
    private router: Router) {}

  ngAfterContentInit() {
    jQuery('[data-toggle="popover"]').popover({
      placement: 'right',
      animation: true,
      template: this.utilService.getPopoverCustomTemplate('btn-danger')
    });
  }

  resetPwd(){
    if (this.model.username.length == 0){
      jQuery('#txtUsername').popover("show");
    }else{
      this.loginService.resetPwd(this.model.username).subscribe(
        data => {
          this.showMsj(data._body, 'info', 5000);
        },
        error => {
          console.log(error);
          this.model.pwd = '';
          this.model.username = '';
          if (!(error._body instanceof ProgressEvent)){
            let tm1: string[] = error._body.split(',');
            let tm2: string[] = tm1[4].split(':');
            this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g,'');
            this.showMsj(this.mensajeAlert, 'danger', 3000);
          }
        }
      );
    }
  }

  changePwd(){
    if (this.comparePwd() && this.model.pwd.length >= 6){
      this.model.pwd = Md5.hashStr(this.model.pwd).toString();
      this.userService.changePassword(this.model).subscribe(
        data => {
          this.showMsj(data._body, 'info', 5000);
          this.model.pwd = '';
          this.modal.close();
        },
        error => {
          console.log(error);
          if (!(error._body instanceof ProgressEvent)){
            let tm1: string[] = error._body.split(',');
            let tm2: string[] = tm1[4].split(':');
            this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g,'');
            this.showMsjChPwd(this.mensajeAlert, 'danger');
          }
        }
      );
    }else {
      this.showMsjChPwd("Contraseña no cumple con especificaciones", "danger");
    }
  }



  onCheckLenght(){
    if (this.model.pwd.length < 6){
      jQuery('#nuevoPwd').popover('show');
    }else{
      jQuery('#nuevoPwd').popover('hide');
    }
  }

  onCheckEqual(){
    if (this.comparePwd()){
      jQuery('#confirmar').popover('hide');
    }else{
      jQuery('#confirmar').popover('show');
    }
  }

  onKeyUpUsername(): boolean{
    if (this.model.username.length == 0){
      jQuery('#txtUsername').popover("show");
      return false;
    }else{
      jQuery('#txtUsername').popover("hide");
      return true;
    }
  }

  comparePwd(): boolean {
    return this.model.pwd == this.confirmPwd;
  }

  login(){
    if (this.onKeyUpUsername() == true){
      this.model.pwd = Md5.hashStr(this.model.pwd).toString();
      this.loginService.login(this.model).subscribe(
        data => {
          localStorage.setItem("token", JSON.parse(JSON.stringify(data))._body);
          this.loginService.getIdleConfig().subscribe(
            data => {
              let params: Parametros[] = JSON.parse(JSON.parse(JSON.stringify(data))._body);
              for (var i: number = 0; i < params.length; i++){
                switch (params[i].nombre){
                  case 'idleTime': this.utilService.idleWait = parseInt(params[i].valor);break;
                  case 'idleTimeOut': this.utilService.idleTimeOutMsj = parseInt(params[i].valor);break;
                }
              }
              this.loginService.getLoggedUser(this.model.username).subscribe(
                data => {
                  let userLogged: Usuarios = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                  if (userLogged.cambioPassword == false){
                    localStorage.setItem("logged", JSON.stringify(userLogged));
                    this.router.navigateByUrl('app/home');
                  }else{
                    this.model.pwd = '';
                    this.modal.open();
                  }
                },
                error => {
                  console.log(error);
                  if (!(error._body instanceof ProgressEvent)){
                    let tm1: string[] = error._body.split(',');
                    let tm2: string[] = tm1[4].split(':');
                    this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g,'');
                    this.showMsj(this.mensajeAlert, 'danger',3000);
                  }
                }
              );
            },
            error => {
              console.log(error);
              if (!(error._body instanceof ProgressEvent)){
                let tm1: string[] = error._body.split(',');
                let tm2: string[] = tm1[4].split(':');
                this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g,'');
                this.showMsj(this.mensajeAlert, 'danger',3000);
              }
            }
          );
        },
        error => {
          console.log(error);
          this.model.pwd = '';
          if (!(error._body instanceof ProgressEvent)){
            let tm1: string[] = error._body.split(',');
            let tm2: string[] = tm1[4].split(':');
            this.mensajeAlert = tm2[1].replace(/[\[\]"]+/g,'');
            this.showMsj(this.mensajeAlert, 'danger', 3000);
          }
        }
      );
    }
  }

  cancelChgPwd(){
    this.confirmPwd = '';
    this.model.pwd = '';
    this.modal.close();
  }

  showMsjChPwd(msj: string, msjClass: string){
    this.msjChPwd = true;
    this.mensajeAlert = msj;
    this.setClassAlert(msjClass);
    let timer = Observable.timer(3000);
    timer.subscribe(x => this.closeMsjChPwd());
  }

  showMsj(msj: string, msjClass: string, ms: number) {
    this.hasMsj = true;
    this.mensajeAlert = msj;
    this.setClassAlert(msjClass);
    let timer = Observable.timer(ms);
    timer.subscribe(x => this.closeMsj());
  }

  setClassAlert(msjClass: string) {
    this.classMsjDanger = false;
    this.classMsjInfo = false;
    switch (msjClass) {
      case 'danger':
        this.classMsjDanger = true;
        break;
      case 'info':
        this.classMsjInfo = true;
        break;
    }
  }

  closeMsjChPwd(){
    this.msjChPwd = false;
  }

  closeMsj() {
    this.hasMsj = false;
  }
}
