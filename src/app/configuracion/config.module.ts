/**
 * Created by jdominguez on 1/25/17.
 */
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Config} from "./config/config";

declare var global: any;
// libs
/* tslint:disable */
var markdown = require('markdown').markdown;
/* tslint:enable */
global.markdown = markdown;

export const routes = [
  {path: '', redirectTo: 'config', pathMatch: 'full'},
  {path: 'config', component: Config},
];

@NgModule({
  declarations: [
    Config
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})

export class ConfigModule {
  static routes = routes;
}
