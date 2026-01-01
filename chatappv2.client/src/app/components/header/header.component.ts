import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
    // Subscribe to the global user state
    // This updates automatically whenever you login or logout!
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
