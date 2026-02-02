import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { AuthService, User } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: false,
})
export class AdminProfilePage implements OnInit {
    user: User | null = null;
    isEditing = false;
    editData = {
        name: '',
        phone: '',
    };

    // Password Change State
    isChangingPassword = false;
    passwordData = {
        old_password: '',
        new_password: '',
        confirm_password: ''
    };

    constructor(
        private authService: AuthService,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.loadProfile();
    }

    ionViewWillEnter() {
        this.loadProfile();
    }

    async loadProfile() {
        this.user = await this.authService.getProfile();
        if (this.user) {
            this.editData.name = this.user.full_name;
            this.editData.phone = this.user.phone || '';
        }
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing && this.user) {
            // Reset if cancelled
            this.editData.name = this.user.full_name;
            this.editData.phone = this.user.phone || '';
        }
    }

    async saveProfile() {
        if (!this.editData.name) {
            this.showToast('Nama tidak boleh kosong', 'danger');
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Menyimpan profil...' });
        await loading.present();

        try {
            const success = await this.authService.updateProfile(this.editData);
            if (success) {
                this.showToast('Profil berhasil diperbaharui', 'success');
                this.isEditing = false;
                this.loadProfile();
            }
        } catch (error: any) {
            this.showToast(error.message || 'Gagal menyimpan profil', 'danger');
        } finally {
            loading.dismiss();
        }
    }

    toggleChangePassword() {
        this.isChangingPassword = !this.isChangingPassword;
        this.passwordData = {
            old_password: '',
            new_password: '',
            confirm_password: ''
        };
    }

    async submitChangePassword() {
        if (!this.passwordData.old_password || !this.passwordData.new_password) {
            this.showToast('Mohon lengkapi semua field password', 'warning');
            return;
        }

        if (this.passwordData.new_password !== this.passwordData.confirm_password) {
            this.showToast('Konfirmasi password baru tidak cocok', 'danger');
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Mengganti password...' });
        await loading.present();

        try {
            const success = await this.authService.changePassword({
                old_password: this.passwordData.old_password,
                new_password: this.passwordData.new_password
            });

            if (success) {
                this.showToast('Password berhasil diganti', 'success');
                this.isChangingPassword = false;
                this.passwordData = { old_password: '', new_password: '', confirm_password: '' };
            }
        } catch (error: any) {
            this.showToast(error.message || 'Gagal mengganti password', 'danger');
        } finally {
            loading.dismiss();
        }
    }

    async onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            this.showToast('Ukuran foto maksimal 2MB', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Mengupload foto...' });
        await loading.present();

        try {
            const avatarUrl = await this.authService.uploadAvatar(file);
            if (avatarUrl) {
                this.showToast('Foto profil berhasil diupload', 'success');
                this.loadProfile(); // Refresh to see new image
            }
        } catch (error: any) {
            this.showToast(error.message || 'Gagal upload foto', 'danger');
        } finally {
            loading.dismiss();
        }
    }

    triggerFileInput() {
        document.getElementById('avatar-input')?.click();
    }

    async logout() {
        const alert = await this.alertCtrl.create({
            header: 'Konfirmasi Logout',
            message: 'Apakah Anda yakin ingin keluar?',
            buttons: [
                { text: 'Batal', role: 'cancel' },
                {
                    text: 'Ya, Keluar',
                    handler: () => {
                        this.authService.logout();
                    }
                }
            ]
        });
        await alert.present();
    }

    private async showToast(message: string, color: string = 'dark') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color,
            position: 'top'
        });
        await toast.present();
    }
}
