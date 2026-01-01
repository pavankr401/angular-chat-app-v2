import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css'],
  standalone: false
})
export class AddFriendComponent implements OnInit {
  searchEmail: string = '';
  foundUser: any = null;
  suggestions: any[] = []; // <--- New List

  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any = null;

  constructor(private api: ApiService, private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    if (this.currentUser) {
      this.loadSuggestions();
    }
  }

  loadSuggestions() {
    this.api.getSuggestions(this.currentUser.id).subscribe({
      next: (data: any) => this.suggestions = data,
      error: (err) => console.error("Could not load suggestions", err)
    });
  }

  onSearch() {
    this.errorMessage = '';
    this.successMessage = '';
    this.foundUser = null;

    if (!this.searchEmail) return;

    this.api.searchUser(this.searchEmail).subscribe({
      next: (user: any) => {
        if (user.id === this.currentUser.id) {
          this.errorMessage = "You cannot add yourself.";
        } else {
          this.foundUser = user;
        }
      },
      error: (err) => this.errorMessage = 'User not found.'
    });
  }

  // Refactored to accept an optional user argument
  onSendRequest(targetUser: any = null) {
    const userToAdd = targetUser || this.foundUser;

    if (!userToAdd || !this.currentUser) return;

    this.api.addFriend(this.currentUser.id, userToAdd.id).subscribe({
      next: (res) => {
        this.successMessage = `Request sent to ${userToAdd.username}!`;

        // UI Cleanup
        if (targetUser) {
          // If added from suggestions, remove them from the list
          this.suggestions = this.suggestions.filter(u => u.id !== userToAdd.id);
        } else {
          // If added from search, clear search
          this.foundUser = null;
          this.searchEmail = '';
        }
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to send request.';
      }
    });
  }
}
