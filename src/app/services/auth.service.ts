import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

export interface User {
    id: number;
    email: string; // Changed from username
    full_name: string; // Changed from fullName to match DB default
    role: 'siswa' | 'admin';
    phone?: string;
    avatar?: string;
    avatar_url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    // Update this URL if testing on device (use IP address instead of localhost)
    private apiUrl = 'https://maribelajar.rplbc-23.com/api-maribelajar';

    constructor(
        private router: Router,
        private http: HttpClient,
        private toastCtrl: ToastController
    ) {
        this.checkToken();
    }

    checkToken() {
        const userJson = localStorage.getItem('user_session');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                this.userSubject.next(user);
            } catch (e) {
                this.logout();
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    isAdmin(): boolean {
        return this.userSubject.value?.role === 'admin';
    }

    getCurrentUser(): User | null {
        return this.userSubject.value;
    }

    async login(credentials: { email: string; password: string }): Promise<void> {
        console.log('AuthService: login called', credentials);
        console.log('AuthService: API URL', `${this.apiUrl}/login.php`);

        try {
            const response: any = await firstValueFrom(
                this.http.post(`${this.apiUrl}/login.php`, credentials)
            );
            console.log('AuthService: API Response', response);

            if (response && response.status === 'success') {
                this.setSession(response.user);
                return; // Success
            }

            throw new Error(response?.message || 'Login failed');
        } catch (error: any) {
            console.error('Login error', error);
            // Extract error message from API response if available
            let errorMessage = 'Terjadi kesalahan koneksi';
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    async register(data: { fullName: string; email: string; password: string; phone?: string }): Promise<void> {
        try {
            const response: any = await firstValueFrom(
                this.http.post(`${this.apiUrl}/register.php`, data)
            );

            if (response && response.status === 'success') {
                return;
            }
            throw new Error(response?.message || 'Gagal mendaftar');
        } catch (error: any) {
            console.error('Register error', error);
            let errorMessage = 'Gagal mendaftar';
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    // --- Profile Management ---

    async getProfile(): Promise<User | null> {
        const currentUser = this.userSubject.value;
        if (!currentUser) return null;

        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.apiUrl}/api-profile.php?id=${currentUser.id}`)
            );

            if (response && response.success) {
                // Update local session with latest data
                const updatedUser = { ...currentUser, ...response.data };
                this.setSession(updatedUser);
                return updatedUser;
            }
        } catch (error) {
            console.error('Get profile error', error);
        }
        return currentUser;
    }

    async updateProfile(data: { name: string; phone: string }): Promise<boolean> {
        const currentUser = this.userSubject.value;
        if (!currentUser) return false;

        try {
            const payload = { ...data, id: currentUser.id, action: 'update_profile' };
            const response: any = await firstValueFrom(
                this.http.post(`${this.apiUrl}/api-profile.php?action=update_profile`, payload)
            );

            if (response && response.success) {
                // Fetch profile again to update session
                await this.getProfile();
                return true;
            }
            throw new Error(response?.message);
        } catch (error) {
            console.error('Update profile error', error);
            throw error;
        }
    }

    async changePassword(data: { old_password: string; new_password: string }): Promise<boolean> {
        const currentUser = this.userSubject.value;
        if (!currentUser) return false;

        try {
            const payload = { ...data, id: currentUser.id, action: 'change_password' };
            const response: any = await firstValueFrom(
                this.http.post(`${this.apiUrl}/api-profile.php?action=change_password`, payload)
            );

            if (response && response.success) {
                return true;
            }
            throw new Error(response?.message);
        } catch (error) {
            console.error('Change password error', error);
            throw error;
        }
    }

    async uploadAvatar(file: File): Promise<string | null> {
        const currentUser = this.userSubject.value;
        if (!currentUser) return null;

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('id', currentUser.id.toString());
            formData.append('action', 'upload_avatar');

            const response: any = await firstValueFrom(
                this.http.post(`${this.apiUrl}/api-profile.php?action=upload_avatar`, formData)
            );

            if (response && response.success) {
                // Fetch profile again to update session
                await this.getProfile();
                return response.avatar_url;
            }
            throw new Error(response?.message);
        } catch (error) {
            console.error('Upload avatar error', error);
            throw error;
        }
    }

    // --- End Profile Management ---

    logout() {
        localStorage.removeItem('user_session');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    private setSession(user: User) {
        localStorage.setItem('user_session', JSON.stringify(user));
        this.userSubject.next(user);
    }
}
