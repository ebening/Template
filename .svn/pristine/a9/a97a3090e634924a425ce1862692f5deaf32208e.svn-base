import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { Design } from './design.component';

import {ModalModule} from "ng2-modal";
import {DataTableModule} from "angular2-datatable";

import {FileUploadModule} from "ng2-file-upload";
import {FileDropModule} from 'angular2-file-drop';
import {Select2Module} from "ng2-select2";
import {TooltipModule} from "ng2-bootstrap";
import {WidgetModule} from "../layout/widget/widget.module";

export const routes = [
  { path: '', component: Design, pathMatch: 'full' }
];


@NgModule({
  imports: [
      CommonModule,
      FileUploadModule,
      FileDropModule,
      FormsModule,
      WidgetModule,
      TooltipModule.forRoot(),
      RouterModule.forChild(routes)],
  declarations: [
    Design
  ]
})
export class DesignModule {
  static routes = routes;
}

