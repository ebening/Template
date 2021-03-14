import {
  Component, EventEmitter, OnInit, ElementRef, Output, ViewChild, style, animate,
  transition, trigger
} from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import {UtilService} from "../../service/util.service";
import {Usuarios} from "../../model/Usuarios";
import {LoginService} from "../../service/login.service";
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Observable} from "rxjs";
declare var jQuery: any;

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html',
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
export class Navbar implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
  $el: any;
  config: any;
  router: Router;

  private userLogged: Usuarios = new Usuarios();

  // ******** IDLE ******** //
  private showIdleState: boolean = false;
  private idleState: string = 'Not started';
  private timeOut: boolean = false;
  private countdown: number = 0;

  constructor(el: ElementRef, config: AppConfig, router: Router,
              private util: UtilService, private idle: Idle,
              private loginService: LoginService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;

    // ***** SET IDLE MONITOR ********* //
    idle.setIdle(util.idleWait);  // Idle TimeOut
    idle.setTimeout(util.idleTimeOutMsj); // TimeOut Period After 10 seconds te user will considered timed out
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);  // Set the default interrupts like clicks, scrolls, touches

    idle.onIdleEnd.subscribe(() => {
      this.countdown = 0;
      this.idleState = 'Actividad Detectada';
      let timer = Observable.timer(3000);
      timer.subscribe(x => this.showIdleState = false);
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Sesion expirada';
      this.timeOut = true;
      this.logout();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'La sesion se cerrara por inactividad en: ' + countdown + ' segundos';
      this.countdown = countdown;
      this.showIdleState = true;
      console.log("Cerrar Session en: " + countdown + " segundos");
    });
    this.idle.watch();
  }

  reset(){
    this.showIdleState = false;
    this.idle.watch();
    this.idleState = 'Started';
    this.timeOut = false;
  }


  logout(){
    this.loginService.logout().subscribe(
      data => {
        localStorage.clear();
        this.router.navigateByUrl("login");
      },
      error => {
        console.log(error);
      }
    );
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
  }

  onDashboardSearch(f): void {
    this.router.navigate(['/app', 'extra', 'search'], { queryParams: { search: f.value.search } });
  }

  ngOnInit(): void {
    if (this.loginService.checkLogin() == false){
      this.router.navigateByUrl('login');
    }else {
      this.userLogged = this.util.getUsuarioLogged();
      setTimeout(() => {
        let $chatNotification = jQuery('#chat-notification');
        $chatNotification.removeClass('hide').addClass('animated fadeIn')
          .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            $chatNotification.removeClass('animated fadeIn');
            setTimeout(() => {
              $chatNotification.addClass('animated fadeOut')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
                  ' oanimationend animationend', () => {
                  $chatNotification.addClass('hide');
                });
            }, 8000);
          });
        $chatNotification.siblings('#toggle-chat')
          .append('<i class="chat-notification-sing animated bounceIn"></i>');
      }, 4000);

      this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
        jQuery(this).parents('.input-group')
          [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
      });
    }
  }
}
