import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent } from '../app/login/login.component'
import {RequestComponent} from '../app/request/request.component'
import {LogoutComponent } from '../app/logout/logout.component'
import { HomePageComponent} from '../app/home-page/home-page.component';
import { UrlPermission} from '../app/services/urlPermission';
import { AdminComponent } from '../app/admin/admin.component';
import {  SignupComponent} from '../app/signup/signup.component';
import { HeaderComponent} from '../app/header/header.component';
import { ChatLobbyComponent} from '../app/chat-lobby/chat-lobby.component';
import { SidebarComponent } from '../app/sidebar/sidebar.component';
import { ToolbarComponent } from '../app/toolbar/toolbar.component';
import { RequestLandingComponent } from '../app/request-landing/request-landing.component';
import { RequestLoginComponent } from '../app/request-login/request-login.component';
const routes: Routes = [ 
  {path : 'login' , component : LoginComponent},
  {path : 'request' , component : RequestComponent,},
  {path : 'logout' , component : LogoutComponent,canActivate:[]},
  {path : 'admin' , component : AdminComponent, canActivate:[]},
  {path : 'signup' , component : SignupComponent, canActivate:[]},
  {path : 'header' , component : HeaderComponent, canActivate:[]},
  {path : 'chatLobby' , component : ChatLobbyComponent, canActivate:[]},
  {path : '' , component: LoginComponent, canActivate:[]},
  {path : 'sidebar' , component: SidebarComponent, canActivate:[]},
  {path : 'toolbar' , component: ToolbarComponent, canActivate:[]},
  {path : 'home' , component: HomePageComponent, canActivate:[]},
  {path : 'requestLanding' , component: RequestLandingComponent, canActivate:[]},
  {path : 'requestLogin' , component: RequestLoginComponent, canActivate:[]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  
  




 }


no
 
