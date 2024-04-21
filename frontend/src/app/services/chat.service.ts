import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;

  public connect(url: string): void {
    this.socket$ = webSocket(url);
  }

  public sendMessage(message: string): void {
    this.socket$.next(message);
  }

  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
