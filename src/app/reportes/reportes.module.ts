/**
 * Created by jdominguez on 1/25/17.
 */
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var global: any;
// libs
/* tslint:disable */
var markdown = require('markdown').markdown;
/* tslint:enable */
global.markdown = markdown;

import {Reporte1} from './reporte1/reporte1';
import {Reporte2} from "./reporte2/reporte2";

export const routes = [
  {path: '', redirectTo: 'reporte1', pathMatch: 'full'},
  {path: 'reporte1', component: Reporte1},
  {path: 'reporte2', component: Reporte2},
];

@NgModule({
  declarations: [
    Reporte1,
    Reporte2
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})

export class ReportesModule {
  static routes = routes;
}
