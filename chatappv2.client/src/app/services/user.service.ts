import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Holds the current user state. Default is null.
  private currentUserSubject = new BehaviorSubject<any>(null);

  // Expose as observable if you want to subscribe to changes
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // SET: Login Component calls this
  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  // GET: Other components call this to see who is logged in
  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // LOGOUT: Clear the state
  logout() {
    this.currentUserSubject.next(null);
  }
}
