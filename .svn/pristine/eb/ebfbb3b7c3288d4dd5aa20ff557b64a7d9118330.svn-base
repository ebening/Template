/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';
import {Keepalive} from "@ng-idle/keepalive";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {LoginService} from "./service/login.service";
import {Router} from "@angular/router";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './scss/application.scss'
  ],
  template: `<router-outlet></router-outlet>`
})
export class App {



  constructor(public appState: AppState) {}

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }



}
