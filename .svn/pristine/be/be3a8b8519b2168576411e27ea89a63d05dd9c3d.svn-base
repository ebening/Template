/**
 * Created by jdominguez on 2/1/17.
 */
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {EspaciosComponent} from "./espacios";
import {View1} from "./view1/view1";
import {ChartsModule} from "ng2-charts";

import 'webpack-raphael';
import 'easy-pie-chart/dist/jquery.easypiechart.js';
import {WidgetModule} from "../layout/widget/widget.module";
import {FlotChartModule} from "../components/flot/flot.module";
import {MorrisChartModule} from "../components/morris/morris.module";
import {Nvd3ChartModule} from "../components/nvd3/nvd3.module";
import {RickshawChartModule} from "../components/rickshaw/rickshaw.module";
import {FlotChartAnimator} from "./view1/flot-chart-animator/flot-chart-animator.directive";
import {UdpMediosEspaciosService} from "../service/sp/udpMediosEspacios.service";
import {ModalModule} from "ng2-modal";
import {PaginationModule, TooltipModule} from "ng2-bootstrap";
import {DataTableModule} from "angular2-datatable";
import {EspaciosUbicacionesService} from "../service/espaciosUbicaciones.service";
import {MecanicasProdService} from "../service/mecanicasProductos.service";

declare var global: any;
// libs
/* tslint:disable */
var markdown = require('markdown').markdown;
/* tslint:enable */
global.markdown = markdown;

export const routes = [
  {path: '', redirectTo: 'espacios', pathMatch: 'full'},
  {
    path: 'espacios/:dataId/:versionNum',
    component: EspaciosComponent,
    children: [
      {path: '', component: View1},
    ]
  },
];

@NgModule({
  declarations: [
    EspaciosComponent,
    FlotChartAnimator,
    View1,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ChartsModule,
    WidgetModule,
    FlotChartModule,
    MorrisChartModule,
    Nvd3ChartModule,
    RickshawChartModule,
    ModalModule,
    PaginationModule.forRoot(),
    DataTableModule,
    TooltipModule
  ],
  providers: [
    UdpMediosEspaciosService,
    EspaciosUbicacionesService,
    MecanicasProdService
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EspaciosModule {
  static routes = routes;
}
