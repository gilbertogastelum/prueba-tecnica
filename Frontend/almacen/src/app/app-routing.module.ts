import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//COMPONENTES GENERADOS
import {SalidasComponent} from './components/salidas/salidas.component';
import {EntradasComponent} from './components/entradas/entradas.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { HomeComponent } from './components/home/home.component';
import { InventarioComponent } from './components/inventario/inventario.component';

const routes: Routes = [
  {path: '',           component: HomeComponent,       pathMatch:'full'},
  {path: 'inventario', component: InventarioComponent, pathMatch:'full'},
  {path: 'entradas',   component: EntradasComponent,   pathMatch:'full'},
  {path: 'salidas',    component: SalidasComponent,    pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
