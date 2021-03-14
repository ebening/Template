import {Component, ElementRef, ChangeDetectorRef} from '@angular/core';
import {EtiquetaService} from "../service/etiquetas.service";
import { Router } from '@angular/router';
import {UtilService} from "../service/util.service";
declare var jQuery: any;

@Component({
  selector: 'inbox',
  templateUrl: './inbox.template.html',
  styleUrls: ['./inbox.style.scss'],
})

export class Inbox {
  eventoListShow: boolean = true;
  eventoFormShow: boolean = false;
  mailDetailShow: boolean = false;
  currentMail: any;
  currentFolderName: string = 'Inbox';
  $el: any;
  repliedMessage: any;

  /* ******** Variables *********** */
  private btnTitle: string = 'Nuevo';
  private msjAlert: string = 'Msj Prueba';
  private showAlert: boolean = false;

  constructor(el: ElementRef, private util: UtilService,
              private etService: EtiquetaService,
              private router: Router,
              private dc: ChangeDetectorRef) {
    this.$el = jQuery(el.nativeElement);


  }

  showAlertFunction(msj){
    this.msjAlert = msj;
    this.showAlertAnimated(this.$el);
  }

  handleComposeBtn(event): void {
    if (this.eventoFormShow == true){
      this.changeEmailComponents('mailList');
    }else {
      this.changeEmailComponents('mailForm');
    }
  }



  changeEmailComponents(componentName: string): void {
    let mailState = {
      'mailList': (that): void => {
        that.eventoFormShow = that.mailDetailShow = false;
        that.eventoListShow = true;
        that.btnTitle = 'Nuevo';
        jQuery('#eventoName').popover('hide');
        jQuery('#fechaInicial').popover('hide');
        jQuery('#fechaFinal').popover('hide');
      },

      'mailForm': (that): void => {
        that.eventoListShow = that.mailDetailShow = false;
        that.eventoFormShow = true;
        that.btnTitle = 'Regresar';
      },

      'mailDetail': (that): void => {
        that.eventoListShow = that.eventoFormShow = false;
        that.mailDetailShow = true;
      },
    };

    mailState[componentName](this);
  }

  setFolderName(folderName: string): void {
    this.currentFolderName = folderName;
    if (!this.eventoListShow) {
      this.changeEmailComponents('mailList');
    }
  }
  /* tslint:disable */
  showAlertAnimated($el: any): void {
    let showAlert = function(): void {
      $el.find('#app-alert')
        .removeClass('hide')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(): void {
          jQuery(this).removeClass('animated bounceInLeft');
        });
    };
    showAlert();
  }
  /* tslint:enable */
  changeActiveItem(): void {
    this.$el.find('.nav a').on('click', function(): void {
      jQuery('.nav').find('.active').removeClass('active');
      jQuery(this).parent().addClass('active');
    });
  }

  ngOnInit(): void {
    this.etService.updateEtiquetas();
    this.changeActiveItem();
    this.dc.detectChanges();
  }
}
