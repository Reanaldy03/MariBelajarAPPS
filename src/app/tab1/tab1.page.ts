import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PackagesService, Package } from '../services/packages.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  userName: string = 'Tamu';
  userAvatar: string = '';
  packages: Package[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private packagesService: PackagesService,
    private router: Router
  ) { }

  // Removed duplicate ngOnInit


  selectCategory(category: string) {
    this.router.navigate(['/tabs/tab2'], {
      queryParams: { category: category }
    });
  }

  ngOnInit() {
    // Initial load
  }

  ionViewWillEnter() {
    this.loadUserData();
    this.loadPackages();
  }

  loadUserData() {
    // Force reload from localStorage to get latest avatar
    const userJson = localStorage.getItem('user_session');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userName = user.full_name.split(' ')[0]; // First name only
        this.userAvatar = user.avatar_url || '';
      } catch (e) {
        console.error('Error parsing user session', e);
        this.userName = 'Tamu';
        this.userAvatar = '';
      }
    } else {
      this.userName = 'Tamu';
      this.userAvatar = '';
    }
  }

  loadPackages() {
    this.isLoading = true;
    this.packagesService.getPackages(false).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          // Take only first 5 for the "Popular" section
          const allPackages = Array.isArray(res.data) ? res.data : [res.data];
          this.packages = allPackages.slice(0, 5);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load packages', err);
      }
    });
  }

  doRefresh(event: any) {
    this.loadUserData();
    this.packagesService.getPackages(false).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const allPackages = Array.isArray(res.data) ? res.data : [res.data];
          this.packages = allPackages.slice(0, 5);
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }
}
