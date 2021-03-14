import {MediosAdmin} from "./medios-admin.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TooltipModule} from "ng2-bootstrap";
import {WidgetModule} from "../layout/widget/widget.module";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Ng2SmartTableModule} from "ng2-smart-table";
/**
 * Created by edgar on 02/03/17.
 */

export const routes = [
  {path: '', component: MediosAdmin, pathMatch: 'full'},

];

@NgModule ({
  imports: [
    FormsModule,
    CommonModule,
    WidgetModule,
    TooltipModule.forRoot(),
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    //CustomEditorComponent,
    //CustomRenderComponent
  ],
  declarations: [
    MediosAdmin,
    //CustomEditorComponent,
    //CustomRenderComponent,
  ]

})

export class MediosAdminModule {
  static routes = routes;
}
