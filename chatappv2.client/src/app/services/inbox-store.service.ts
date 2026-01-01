import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { ApiService } from './api.service';
import { ChatService } from './chat.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InboxStoreService {
  private _conversations = new BehaviorSubject<Conversation[]>([]);

  readonly conversations$ = this._conversations.asObservable();

  private isLoaded = false;

  constructor(
    private api: ApiService,
    private chatService: ChatService,
    private userService: UserService
  ) {
    this.initGlobalListeners();
  }

  loadInbox() {
    if (this.isLoaded) return;

    const currentUser = this.userService.currentUserValue;
    if (!currentUser) return;

    this.api.getInbox(currentUser.id).subscribe({
      next: (data) => {
        this._conversations.next(data);
        this.isLoaded = true;
      },
      error: (err) => console.error('Failed to load inbox to store', err)
    });
  }

  refreshInbox() {
    this.isLoaded = false;
    this.loadInbox();
  }

  private initGlobalListeners() {
    this.chatService.newConversation$.subscribe(newChat => {
      const current = this._conversations.value;
      this._conversations.next([newChat, ...current]);
    });

    this.chatService.messageReceived$.subscribe(msg => {
      if (!msg) return;

      const currentList = [...this._conversations.value];
      const currentUser = this.userService.currentUserValue;

      const index = currentList.findIndex(c =>
        c.id === msg.receiverId || // group check
        (c.id === msg.senderId && !c.isGroup) || // 1-1 conversation check
        (c.participants.some(p => p.id === msg.senderId) && !c.isGroup) // 1-1 conversation double check
      );

      if (index > -1) {
        const chat = { ...currentList[index] };

        chat.lastMessagePreview = msg.content;
        chat.lastActivity = new Date(msg.timestamp!);
        chat.lastMessageSenderId = msg.senderId;

        if (!chat.messages) chat.messages = [];
        if (!chat.messages.some(m => m.id === msg.id)) {
          chat.messages.push(msg);
        }

        currentList.splice(index, 1);
        currentList.unshift(chat);

        this._conversations.next(currentList);

      } else {
        this.refreshInbox();
      }
    });
  }
}
