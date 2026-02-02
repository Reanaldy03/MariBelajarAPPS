import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Check if user is authenticated
        if (!this.authService.isAuthenticated()) {
            return this.router.createUrlTree(['/login']);
        }

        // Check if user is admin
        if (this.authService.isAdmin()) {
            return true;
        }

        // If not admin, redirect to student tabs
        return this.router.createUrlTree(['/tabs/tab1']);
    }
}
