import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OfficesComponent } from './offices/offices.component';
import { AgenciesComponent } from './agencies/agencies.component';

const routes: Routes = [
  { path: '', redirectTo: 'prelogin', pathMatch: 'full' },
  { path: 'prelogin', loadChildren: () => import('./prelogin/prelogin.module').then( m => m.PreloginPageModule)},

  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'offices', component: OfficesComponent },
  {path: 'agencies', component:AgenciesComponent},
  { path: 'agencies-maps', loadChildren: './agencies-maps/agencies-maps.module#AgenciesMapsPageModule' },
  //{ path: 'prelogin', loadChildren: './prelogin/prelogin.module#PreloginPageModule' },
  { path:'login', loadChildren:'./login/login.module#LoginPageModule'},
  { path: 'terms-conditions', loadChildren: './terms-conditions/terms-conditions.module#TermsConditionsPageModule' },
  { path: 'agencies02', loadChildren: './agencies02/agencies02.module#Agencies02PageModule' },
  { path: 'ticket', loadChildren: './tab2/tab2.module#Tab2PageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
