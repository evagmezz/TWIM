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
import { FooterComponent } from './footer/footer.component'
import { ChatComponent } from './chat/chat.component';
import {Document} from "typeorm";
import {RippleModule} from "primeng/ripple";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";

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
    ChatComponent,
    FooterComponent,
    RippleModule,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'TWIM'
  themeSelection: boolean = false

  constructor(@Inject(DOCUMENT) private document: Document) {
    let theme = window.localStorage.getItem('theme')
    if(theme) {
      this.themeSelection = theme == 'dark' ? true : false
      this.changeTheme(this.themeSelection)
    }
  }


  ngAfterViewInit() {
    this.changeTheme(this.themeSelection);
  }

  changeTheme(state:boolean) {
    let theme = state ? 'dark' : 'light'
    window.localStorage.setItem('theme', theme)
    let themeLink = this.document['getElementById']('app-themes') as HTMLLinkElement
    themeLink.href = `lara-` + theme + `-purple` + `.css`
  }
}
