import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage implements OnInit {
    email = '';
    password = '';
    showPassword = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            // Redirect based on role
            if (this.authService.isAdmin()) {
                this.router.navigate(['/admin/dashboard']);
            } else {
                this.router.navigate(['/tabs/tab1']);
            }
        }
    }

    async onLogin() {
        console.log('Login attempt started', this.email);

        if (!this.email || !this.password) {
            this.showToast('Mohon isi email dan password', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({
            message: 'Masuk...',
            spinner: 'crescent'
        });
        await loading.present();

        try {
            console.log('Calling authService.login...');
            await this.authService.login({
                email: this.email,
                password: this.password
            });

            if (this.authService.isAdmin()) {
                // Redirect to admin dashboard (create this route later if not exists)
                // For now, redirect to a specific admin page or just tabs if admin dashboard isn't ready
                // Assuming we will create an admin dashboard
                this.router.navigate(['/admin/dashboard']);
            } else {
                this.router.navigate(['/tabs/tab1']);
            }
        } catch (error: any) {
            console.error('Login error caught in page:', error);
            this.showAlert('Gagal Masuk', error.message);
        } finally {
            loading.dismiss();
        }
    }

    async showAlert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        toast.present();
    }
}
