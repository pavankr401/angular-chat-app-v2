import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Conversation } from '../../models/conversation.model';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { InboxStoreService } from '../../services/inbox-store.service'; // IMPORT STORE

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css'],
  standalone: false
})
export class ConversationListComponent implements OnInit, OnDestroy {
  @Output() chatSelected = new EventEmitter<Conversation>();

  conversations: Conversation[] = [];
  currentUser!: User;
  private storeSub: Subscription | undefined;

  constructor(
    private userService: UserService,
    public inboxStore: InboxStoreService // Inject Store
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;

    if (this.currentUser) {
      this.inboxStore.loadInbox();

      this.storeSub = this.inboxStore.conversations$.subscribe(data => {
        this.conversations = data;
      });
    }
  }

  ngOnDestroy() {
    if (this.storeSub) this.storeSub.unsubscribe();
  }

  selectChat(chat: Conversation) {
    this.chatSelected.emit(chat);
  }

  getChatName(chat: Conversation): string {
    if (chat.isGroup) return chat.groupName || 'Unknown Group';
    const other = chat.participants.find(p => p.id !== this.currentUser.id);
    return other ? other.username : 'Unknown User';
  }

  getAvatarLetter(chat: Conversation): string {
    const name = this.getChatName(chat);
    return name.charAt(0).toUpperCase();
  }

  getLastMessagePrefix(chat: Conversation): string {
    if (!chat.lastMessagePreview || !chat.lastMessageSenderId) return '';

    if (chat.lastMessageSenderId === this.currentUser.id) {
      return 'You: ';
    }

    if (chat.isGroup) {
      const sender = chat.participants.find(p => p.id === chat.lastMessageSenderId);
      return sender ? `${sender.username}: ` : '';
    }

    return ''; // Default for DM (Clean look)
  }
}
