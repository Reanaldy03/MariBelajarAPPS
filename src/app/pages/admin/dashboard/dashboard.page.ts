import { Component, OnInit } from '@angular/core';
import { PendaftaranService, PendaftaranItem } from '../../../services/pendaftaran.service';
import { PackagesService, Package } from '../../../services/packages.service';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: false
})
export class DashboardPage implements OnInit {
    segment = 'students'; // 'students' or 'packages'
    pendaftaranList: PendaftaranItem[] = [];
    packagesList: Package[] = [];
    isLoading = false;
    adminName = 'Admin';
    adminAvatar = '';

    constructor(
        private pendaftaranService: PendaftaranService,
        private packagesService: PackagesService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private popoverCtrl: PopoverController,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.checkAdmin();
        // Load initial data
        this.loadData();

        // Subscribe to package updates
        this.packagesService.packageUpdated.subscribe(() => {
            if (this.segment === 'packages') {
                this.loadPackages();
            }
        });
    }

    ionViewWillEnter() {
        // Reload admin profile to get updated avatar
        this.loadAdminProfile();
        this.loadData();
    }

    loadAdminProfile() {
        // Force reload from localStorage to get latest avatar
        const userJson = localStorage.getItem('user_session');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                this.adminName = user.full_name || 'Admin';
                this.adminAvatar = user.avatar_url || '';
            } catch (e) {
                console.error('Error parsing user session', e);
            }
        }
    }

    checkAdmin() {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/tabs/tab1']);
        }
    }

    async loadData() {
        if (this.segment === 'students') {
            await this.loadStudents();
        } else {
            await this.loadPackages();
        }
    }

    async segmentChanged(ev: any) {
        this.segment = ev.detail.value;
        this.loadData();
    }

    async loadStudents() {
        this.isLoading = true;
        this.pendaftaranService.getAllPendaftaran().subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success && response.data) {
                    this.pendaftaranList = Array.isArray(response.data) ? response.data : [response.data];
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    async loadPackages() {
        this.isLoading = true;
        this.packagesService.getPackages(true).subscribe({ // showAll=true
            next: (response) => {
                this.isLoading = false;
                if (response.success && response.data) {
                    this.packagesList = Array.isArray(response.data) ? response.data : [response.data];
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    doRefresh(event: any) {
        if (this.segment === 'students') {
            this.pendaftaranService.getAllPendaftaran().subscribe({
                next: (res) => {
                    if (res.success && res.data) this.pendaftaranList = Array.isArray(res.data) ? res.data : [res.data];
                    event.target.complete();
                },
                error: () => event.target.complete()
            });
        } else {
            this.packagesService.getPackages(true).subscribe({
                next: (res) => {
                    if (res.success && res.data) this.packagesList = Array.isArray(res.data) ? res.data : [res.data];
                    event.target.complete();
                },
                error: () => event.target.complete()
            });
        }
    }

    // --- Actions ---

    async deletePackage(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Hapus Paket?',
            message: 'Data yang dihapus tidak dapat dikembalikan.',
            buttons: [
                { text: 'Batal', role: 'cancel' },
                {
                    text: 'Hapus',
                    role: 'destructive',
                    handler: () => {
                        this.packagesService.deletePackage(id).subscribe({
                            next: () => this.loadPackages(),
                            error: async () => {
                                const a = await this.alertCtrl.create({ header: 'Gagal', message: 'Gagal menghapus paket.', buttons: ['OK'] });
                                await a.present();
                            }
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    goToChat() {
        this.router.navigate(['/admin/chat-list']);
    }

    // --- Profile Popover Logic ---
    async presentProfileMenu(ev: any) {
        const popover = await this.popoverCtrl.create({
            component: AdminProfileMenuComponent,
            event: ev,
            translucent: true,
            componentProps: {
                // Props if needed
            }
        });
        await popover.present();
    }

    logout() {
        this.authService.logout();
    }
}

// Simple inline component for the menu
@Component({
    template: `
    <ion-list lines="none">
      <ion-item button (click)="openProfile()">
        <ion-icon name="person-circle-outline" slot="start"></ion-icon>
        <ion-label>Profil</ion-label>
      </ion-item>
      <ion-item button lines="none" (click)="doLogout()" color="danger">
        <ion-icon name="log-out-outline" slot="start"></ion-icon>
        <ion-label>Logout</ion-label>
      </ion-item>
    </ion-list>
  `,
    standalone: false
})
export class AdminProfileMenuComponent {
    constructor(private popoverCtrl: PopoverController, private authService: AuthService, private router: Router) { }

    openProfile() {
        this.popoverCtrl.dismiss();
        this.router.navigate(['/admin/profile']);
    }

    doLogout() {
        this.popoverCtrl.dismiss();
        this.authService.logout();
    }
}
