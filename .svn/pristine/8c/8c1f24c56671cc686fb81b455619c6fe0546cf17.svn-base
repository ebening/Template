import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {WidgetModule} from "../layout/widget/widget.module";
import {TooltipModule} from "ng2-bootstrap";

import {Inbox} from './inbox.component';
import {MailList} from './mail-list/mail-list.component';
import {MailForm} from './mail-form/mail-form.component';
import {MailDetail} from './mail-detail/mail-detail.component';

import {SearchPipe} from './mail-list/pipes/search-pipe';
import {FoldersPipe} from './mail-list/pipes/folders-pipe';
import {EventoForm} from "./evento-form/evento-form";
import {EventoList} from "./evento-list/evento-list";

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



export const routes = [
  {path: '', component: Inbox, pathMatch: 'full'}
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NKDatetimeModule,
    WidgetModule,
    TooltipModule.forRoot(),
    RouterModule.forChild(routes)],
  declarations: [
    Inbox,
    MailList,
    MailForm,
    EventoForm,
    EventoList,
    MailDetail,
    FoldersPipe,
    SearchPipe,

  ]
})
export class InboxModule {
  static routes = routes;
}
