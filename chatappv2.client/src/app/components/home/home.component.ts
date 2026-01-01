import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {
  // SIMPLE STATE: Just the object
  selectedConversation: Conversation | null = null;
  showCreateGroupPopup: boolean = false;

  constructor(private router: Router) { }

  onChatSelected(chat: Conversation) {
    this.selectedConversation = chat;
  }

  goToManageFriends() {
    this.router.navigate(['/friends']);
  }

  openCreateGroup() {
    this.showCreateGroupPopup = true;
  }

  closeCreateGroup() {
    this.showCreateGroupPopup = false;
  }

  onGroupCreated(newChat: Conversation) {
    this.showCreateGroupPopup = false;
    this.selectedConversation = newChat;
  }
}
