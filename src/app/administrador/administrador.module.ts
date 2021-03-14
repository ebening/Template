/**
 * Created by jdominguez on 1/25/17.
 */
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Admin} from "./admin/admin";


declare var global: any;
// libs
/* tslint:disable */
var markdown = require('markdown').markdown;
/* tslint:enable */
global.markdown = markdown;

export const routes = [
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  {path: 'admin', component: Admin},
];

@NgModule({
  declarations: [
    Admin
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class Adminis {
  static routes = routes;
}
