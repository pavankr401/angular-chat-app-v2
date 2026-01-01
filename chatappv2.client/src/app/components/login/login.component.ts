import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service'; // <--- Import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(
    private api: ApiService,
    private router: Router,
    private userService: UserService,
    private chatService: ChatService // <--- Inject
  ) { }

  onSubmit() {
    this.api.login(this.credentials).subscribe({
      next: (user) => {
        // 1. Save User State
        this.userService.setCurrentUser(user);

        // 2. Start SignalR Connection IMMEDIATELY
        this.chatService.startConnection(user.id);

        // 3. Navigate to Dashboard
        this.router.navigate(['/home']);
      },
      error: (err) => alert('Login Failed')
    });
  }
}
