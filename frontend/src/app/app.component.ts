import { Component, Inject, OnInit} from '@angular/core'
import { AuthService } from './services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component'
import { RouterOutlet } from '@angular/router'
import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import { DOCUMENT } from '@angular/common';
import { DetailsComponent } from './details/details.component'
import { ProfileComponent } from './profile/profile.component'
import { HeaderComponent } from './header/header.component'
import {RippleModule} from "primeng/ripple"
import {InputSwitchModule} from "primeng/inputswitch"
import {FormsModule} from "@angular/forms"
import {Document} from "typeorm"
import {AdminComponent} from "./admin/admin.component"
import {ConfirmationService} from "primeng/api"

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService, HttpClient,  ConfirmationService],
  imports: [
    HttpClientModule,
    LoginComponent,
    RouterOutlet,
    RegisterComponent,
    IndexComponent,
    DetailsComponent,
    ProfileComponent,
    HeaderComponent,
    RippleModule,
    InputSwitchModule,
    FormsModule,
    AdminComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent  {
  title = 'TWIM'


  constructor(@Inject(DOCUMENT) private document: Document) {
    this.setDefaultTheme()
  }

  setDefaultTheme() {
    let theme = window.localStorage.getItem('theme')
    if (!theme) {
      theme = 'light'
      window.localStorage.setItem('theme', theme)
    }
    this.applyTheme(theme)
  }

  applyTheme(theme: string) {
    let themeLink = this.document['getElementById']('app-themes') as HTMLLinkElement
    this.document['documentElement'].classList.remove('dark-theme', 'light-theme')
    this.document['documentElement'].classList.add(theme + '-theme')
    themeLink.href = `lara-` + theme + `-purple` + `.css`
  }
}
