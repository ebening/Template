import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonsModule, PaginationModule  } from 'ng2-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table';

import {ModalModule} from 'angular2-modal';

import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import {FileUploadModule} from "ng2-file-upload";
import {FileDropModule} from 'angular2-file-drop';
import {Ng2SmartTableModule} from "ng2-smart-table";



declare var global: any;
// libs
/* tslint:disable */
var markdown = require('markdown').markdown;
/* tslint:enable */
global.markdown = markdown;
import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';
import 'bootstrap-application-wizard/src/bootstrap-wizard.js';
import 'twitter-bootstrap-wizard/jquery.bootstrap.wizard.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import 'bootstrap-colorpicker';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';

import { TooltipModule, AlertModule, DropdownModule } from 'ng2-bootstrap';
import { Autosize } from 'angular2-autosize';
import { Select2Module } from 'ng2-select2';
import { WidgetModule } from '../layout/widget/widget.module';
import { TextMaskModule } from 'angular2-text-mask';
/* tslint:disable */
import { BootstrapWizardModule } from '../components/wizard/wizard.module';
import { BootstrapApplicationWizard } from './wizard/bootstrap-application-wizard/bootstrap-application-wizard.directive';
import { DropzoneDemo } from '../components/dropzone/dropzone.directive';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
/* tslint:enable */
import { Elements } from './elements/elements.component';
import { Validation } from './validation/validation.component';
import { Wizard } from './wizard/wizard.component';
import { Medios } from './medios/medios.component';
import { MediosAdmin } from './medios-admin/medios-admin.component';
import { Ofertas } from './ofertas/ofertas.component';
import { Base } from './base/base.component';

export const routes = [
  {path: '', redirectTo: 'elements', pathMatch: 'full'},
  {path: 'elements', component: Elements},
  {path: 'validation', component: Validation},
  {path: 'wizard', component: Wizard},
  {path: 'medios/:dataId/:versionNum', component: Medios},
  {path: 'medios-admin', component: MediosAdmin},
  {path: 'ofertas/:dataId/:versionNum', component: Ofertas}
];

@NgModule({
  declarations: [
    Autosize,
    Elements,
    Validation,
    BootstrapApplicationWizard,
    Wizard,
    DropzoneDemo,
    Medios,
    MediosAdmin,
    Ofertas,
    Base,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    DropdownModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    BootstrapWizardModule,
    NKDatetimeModule,
    Select2Module,
    RouterModule.forChild(routes),
    Ng2TableModule,
    DataTableModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    FileUploadModule,
    FileDropModule,
    Ng2SmartTableModule
  ]
})
export class FormModule {
  static routes = routes;
}
