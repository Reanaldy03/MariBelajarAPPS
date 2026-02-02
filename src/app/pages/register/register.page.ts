import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: false
})
export class RegisterPage implements OnInit {
    fullName = '';
    phone = '';
    email = '';
    password = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() { }

    async onRegister() {
        if (this.password !== this.confirmPassword) {
            this.showToast('Password tidak sama', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({
            message: 'Mendaftar...',
            spinner: 'crescent'
        });
        await loading.present();

        try {
            await this.authService.register({
                fullName: this.fullName,
                phone: this.phone,
                email: this.email,
                password: this.password
            });

            this.showToast('Pendaftaran berhasil! Silakan login', 'success');
            this.router.navigate(['/login']);
        } catch (error: any) {
            this.showToast(error.message || 'Gagal mendaftar', 'danger');
        } finally {
            loading.dismiss();
        }
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
