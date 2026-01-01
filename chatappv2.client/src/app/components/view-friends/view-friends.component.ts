import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-view-friends',
  templateUrl: './view-friends.component.html',
  styleUrls: ['./view-friends.component.css'],
  standalone: false
})
export class ViewFriendsComponent implements OnInit {
  friends: User[] = [];
  currentUser!: User;
  isLoading: boolean = false;

  selectedConversation: Conversation | null = null;
  popupTitle: string = '';

  constructor(
    private api: ApiService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    this.loadFriends();
  }

  loadFriends() {
    this.isLoading = true;
    this.api.getFriends(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.friends = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  openChat(friend: User) {
    this.popupTitle = `Chat with ${friend.username}`;

    // NEW LOGIC: Get the real Conversation DTO directly from Backend
    this.api.getConversation(this.currentUser.id, friend.id).subscribe({
      next: (conversationDto) => {
        this.selectedConversation = conversationDto;
      },
      error: (err) => console.error('Failed to open chat', err)
    });
  }

  closeChat() {
    this.selectedConversation = null;
    this.popupTitle = '';
  }
}
