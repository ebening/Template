import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Login } from './login.component';
import {ModalModule} from "ng2-modal";


export const routes = [
  { path: '', component: Login, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ModalModule
  ]
})
export class LoginModule {
  static routes = routes;
}
