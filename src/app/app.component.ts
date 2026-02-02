import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      // Redirect based on role
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
      }
    }
  }
}
