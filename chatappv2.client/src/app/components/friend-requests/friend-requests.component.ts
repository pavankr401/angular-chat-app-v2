import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css'],
  standalone: false
})
export class FriendRequestsComponent implements OnInit {
  requests: any[] = [];
  currentUser: any = null;
  isLoading: boolean = false;

  constructor(private api: ApiService, private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.api.getRequests(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onRespond(inviterId: string, accept: boolean) {
    // inviteeId is ME (currentUser), inviterId is the person in the list
    this.api.respondToRequest(inviterId, this.currentUser.id, accept).subscribe({
      next: () => {
        // UI Optimization: Remove the item from the list immediately
        this.requests = this.requests.filter(u => u.id !== inviterId);

        // Optional: Show a toast/alert
        if (accept) alert("Friend Added!");
      },
      error: (err) => alert('Error processing request')
    });
  }
}
