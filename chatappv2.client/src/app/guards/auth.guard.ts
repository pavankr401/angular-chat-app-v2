// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean {
    // 1. Check if user is logged in
    // (We assume your UserService checks for a JWT token in localStorage)
    if (this.userService.isLoggedIn) {
      return true; // Allow access
    }

    // 2. If not, redirect to login
    this.router.navigate(['/login']);
    return false; // Block access
  }
}
