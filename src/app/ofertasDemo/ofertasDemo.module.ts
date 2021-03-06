/**
 * Created by jdominguez on 2/14/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TooltipModule, PaginationModule} from "ng2-bootstrap";
import {WidgetModule} from "../layout/widget/widget.module";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Select2Module} from "ng2-select2";

import {OfertasDemo} from "./ofertasDemo";
import {OfertasData} from "./ofertasDemo.data";
import {DataTableModule} from "angular2-datatable";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {VigenciaEditor} from "./editors/vigenciaEditor";
import {CategoriaEditor} from "./editors/categoriaEditor";
import {SubCategoEditor} from "./editors/subcategoEditor";

import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';
import {FileDropModule} from "angular2-file-drop";
import {ModalModule} from "ng2-modal";
import {FileUploadModule} from "ng2-file-upload";
//import {Demo2} from "./v2/demo2";




export const routes = [
  {path: '', redirectTo: 'v2', pathMatch: 'full'},
  {path: 'v1', component: OfertasDemo},
  //{path: 'v2/:dataId/:versionNum', component: Demo2}
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    WidgetModule,
    NKDatetimeModule,
    TooltipModule.forRoot(),
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    DataTableModule,
    Ng2SmartTableModule,
    Select2Module,
    FileDropModule,
    FileUploadModule,
    ModalModule,
  ],
  declarations: [
    OfertasDemo,
    VigenciaEditor,
    CategoriaEditor,
    SubCategoEditor,
    //Demo2
  ],
  providers: [
    OfertasData,
  ],
  entryComponents: [
    VigenciaEditor,
    CategoriaEditor,
    SubCategoEditor
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class OfertasDemoModule {
  static routes = routes;
}
