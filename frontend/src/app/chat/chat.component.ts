import { Component, OnInit } from '@angular/core'
import { ChatService } from '../services/chat.service'
import { FormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common';
import { User } from '../index/index.component'
import { AuthService } from '../services/auth.service'
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrls: ['./chat.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    InputTextModule,
    CardModule,
  ],
})
export class ChatComponent implements OnInit {
  messages: string[] = []
  message: string
  currentUser: User
  followers: User[]

  constructor(private chatService: ChatService,     private authService: AuthService) { }

  ngOnInit(): void {
    this.lazyLoad()
  }

  lazyLoad() {
    this.chatService.connect('ws://localhost:4200')
    this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message)
    })
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
    }

  sendMessage(): void {
    this.chatService.sendMessage(this.message)
    this.message = ''
  }
}
