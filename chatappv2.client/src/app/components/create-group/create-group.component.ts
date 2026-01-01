import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
  standalone: false
})
export class CreateGroupComponent implements OnInit {
  @Output() groupCreated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  groupName: string = '';
  friends: User[] = [];
  selectedMemberIds: Set<string> = new Set();
  isLoading: boolean = false;
  currentUser: any;

  constructor(private api: ApiService, private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    this.loadFriends();
  }

  loadFriends() {
    this.api.getFriends(this.currentUser.id).subscribe(data => {
      this.friends = data;
    });
  }

  toggleSelection(userId: string) {
    if (this.selectedMemberIds.has(userId)) {
      this.selectedMemberIds.delete(userId);
    } else {
      this.selectedMemberIds.add(userId);
    }
  }

  create() {
    if (!this.groupName.trim() || this.selectedMemberIds.size === 0) return;

    this.isLoading = true;
    const memberIds = Array.from(this.selectedMemberIds);

    this.api.createGroup(this.currentUser.id, this.groupName, memberIds).subscribe({
      next: (conversation) => {
        this.isLoading = false;
        this.groupCreated.emit(conversation); // Pass the new group back to Home
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
