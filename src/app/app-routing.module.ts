// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { HeartrateComponent } from './heartrate/heartrate.component';
// import { OfficesComponent } from './offices/offices.component';
// import { GenerateMeetingComponent } from './generate-meeting/generate-meeting.component';
// import { MeetingComponent } from './meeting/meeting.component';

// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
//   { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },

//   { path: 'see-people', loadChildren: './see-people/see-people.module#SeePeoplePageModule' },
//   { path: 'heart-rate/:id', component: HeartrateComponent },
//   { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
//   { path: 'modal-notification', loadChildren: './modal-notification/modal-notification.module#ModalNotificationPageModule' },
//   { path: 'offices', component: OfficesComponent },
//   { path: 'gen-meeting', component: GenerateMeetingComponent },
//   { path: 'meeting', component: MeetingComponent },
//   { path: 'agencies-maps', loadChildren: './agencies-maps/agencies-maps.module#AgenciesMapsPageModule' },



// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeartrateComponent } from './heartrate/heartrate.component';
import { OfficesComponent } from './offices/offices.component';
import { GenerateMeetingComponent } from './generate-meeting/generate-meeting.component';
import { MeetingComponent } from './meeting/meeting.component';
import { AgenciesComponent } from './agencies/agencies.component';

const routes: Routes = [
  { path: '', redirectTo: 'prelogin', pathMatch: 'full' },
  { path: 'prelogin', loadChildren: () => import('./prelogin/prelogin.module').then( m => m.PreloginPageModule)},
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },

  { path: 'see-people', loadChildren: './see-people/see-people.module#SeePeoplePageModule' },
  { path: 'heart-rate/:id', component: HeartrateComponent },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'modal-notification', loadChildren: './modal-notification/modal-notification.module#ModalNotificationPageModule' },
  { path: 'offices', component: OfficesComponent },
  { path: 'gen-meeting', component: GenerateMeetingComponent },
  { path: 'meeting', component: MeetingComponent },
  {path: 'agencies', component:AgenciesComponent},
  { path: 'agencies-maps', loadChildren: './agencies-maps/agencies-maps.module#AgenciesMapsPageModule' },
  //{ path: 'prelogin', loadChildren: './prelogin/prelogin.module#PreloginPageModule' },
  { path:'login', loadChildren:'./login/login.module#LoginPageModule'},


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
