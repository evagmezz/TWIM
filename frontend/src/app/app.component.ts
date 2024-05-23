import {AfterViewInit, Component, Inject} from '@angular/core'
import { AuthService } from './services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component'
import { RouterOutlet } from '@angular/router'
import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import {DOCUMENT, NgIf} from '@angular/common'
import { DetailsComponent } from './details/details.component'
import { ProfileComponent } from './profile/profile.component'
import { HeaderComponent } from './header/header.component'
import {RippleModule} from "primeng/ripple";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {Document} from "typeorm";

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService, HttpClient],
  imports: [
    HttpClientModule,
    LoginComponent,
    RouterOutlet,
    RegisterComponent,
    IndexComponent,
    NgIf,
    DetailsComponent,
    ProfileComponent,
    HeaderComponent,
    RippleModule,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements  AfterViewInit {
  title = 'TWIM'

  themeSelection: boolean = false

  ngAfterViewInit() {
    this.changeTheme(this.themeSelection);
  }

  constructor(@Inject(DOCUMENT) private document: Document
  ) {
    let theme = window.localStorage.getItem('theme')
    if (theme) {
      this.themeSelection = theme == 'light'
      this.changeTheme(this.themeSelection)
    }
  }

  changeTheme(state: boolean) {
    let theme = state ? 'dark' : 'light'
    window.localStorage.setItem('theme', theme)
    let themeLink = this.document['getElementById']('app-themes') as HTMLLinkElement
    themeLink.href = `lara-` + theme + `-purple` + `.css`
  }

}
