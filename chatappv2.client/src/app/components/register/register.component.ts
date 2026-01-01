import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false // Check if your template uses standalone or modules
})
export class RegisterComponent {
  user: Partial<User> = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private api: ApiService, private router: Router) { }

  onSubmit() {
    this.api.register(this.user).subscribe({
      next: (res) => {
        alert('Registration Successful!');
        this.router.navigate(['/login']); // Redirect to login
      },
      error: (err) => {
        alert('Error: ' + err.error);
      }
    });
  }
}
