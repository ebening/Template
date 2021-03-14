import { Routes, RouterModule }  from '@angular/router';
import { Layout } from './layout.component';
import {Home} from "../home/home";
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'inbox', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
    { path: 'inbox', loadChildren: '../inbox/inbox.module#InboxModule' },
    { path: 'admin', loadChildren: '../administrador/administrador.module#Adminis'},
    { path: 'reportes', loadChildren: '../reportes/reportes.module#ReportesModule' },
    { path: 'config', loadChildren: '../configuracion/config.module#ConfigModule'},
    { path: 'espacios', loadChildren: '../espacios/espacios.module#EspaciosModule'},
    { path: 'forms', loadChildren: '../forms/forms.module#FormModule' },
    { path: 'ui', loadChildren: '../ui-elements/ui-elements.module#UiElementsModule' },
    { path: 'extra', loadChildren: '../extra/extra.module#ExtraModule' },
    { path: 'tables', loadChildren: '../tables/tables.module#TablesModule' },
    { path: 'maps', loadChildren: '../maps/maps.module#MapsModule' },
    { path: 'grid', loadChildren: '../grid/grid.module#GridModule' },
    { path: 'widgets', loadChildren: '../widgets/widgets.module#WidgetsModule' },
    { path: 'ofertasDemo', loadChildren: '../ofertasDemo/ofertasDemo.module#OfertasDemoModule'},
    { path: 'mediosAdmin', loadChildren: '../medios-admin/medios-admin.module#MediosAdminModule'},
    { path: 'design', loadChildren: '../design/design.module#DesignModule' }
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
