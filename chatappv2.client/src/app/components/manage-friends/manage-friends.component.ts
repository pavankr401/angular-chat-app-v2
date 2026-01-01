import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-friends',
  templateUrl: './manage-friends.component.html',
  styleUrls: ['./manage-friends.component.css'],
  standalone: false
})
export class ManageFriendsComponent implements OnInit {
  friendTabs: string[] = ['Add Friend', 'Friend Requests', 'My Friends'];
  activeTabIndex: number = 0;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Security check only: Redirect if not logged in
    if (!this.userService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
