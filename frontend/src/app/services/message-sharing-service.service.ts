import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Message } from 'primeng/api'

@Injectable({
  providedIn: 'root',
})
export class MessageSharingService {
  private messageSource = new BehaviorSubject<Message[]>([])
  currentMessage = this.messageSource.asObservable()

  constructor() {}

  changeMessage(messages: Message[]) {
    this.messageSource.next(messages)
  }
}
