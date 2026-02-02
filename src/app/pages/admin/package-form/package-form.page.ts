import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagesService, Package } from '../../../services/packages.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-package-form',
    templateUrl: './package-form.page.html',
    styleUrls: ['./package-form.page.scss'],
    standalone: false
})
export class PackageFormPage implements OnInit {
    isEdit = false;
    pkg: Package = {
        name: '',
        description: '',
        price: 0,
        subjects: '',
        level: '',
        duration: '1 Bulan',
        isActive: true
    };

    levels = ['SD', 'SMP', 'SMA', 'Umum'];
    durations = ['1 Bulan', '3 Bulan', '6 Bulan', 'Per Pertemuan'];

    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private packagesService: PackagesService,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.loadPackage(+id);
        }
    }

    loadPackage(id: number) {
        this.isLoading = true;
        this.packagesService.getPackageById(id).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success && res.data && !Array.isArray(res.data)) {
                    this.pkg = res.data;
                }
            },
            error: () => {
                this.isLoading = false;
                // Error handling
            }
        });
    }

    async savePackage() {
        if (!this.pkg.name || !this.pkg.price) {
            const alert = await this.alertCtrl.create({ header: 'Gagal', message: 'Nama dan Harga wajib diisi', buttons: ['OK'] });
            await alert.present();
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Menyimpan...' });
        await loading.present();

        const request = this.isEdit
            ? this.packagesService.updatePackage(this.pkg.id!, this.pkg)
            : this.packagesService.createPackage(this.pkg);

        request.subscribe({
            next: async (res) => {
                loading.dismiss();
                if (res.success) {
                    const toast = await this.toastCtrl.create({
                        message: this.isEdit ? 'Paket diperbarui' : 'Paket dibuat',
                        duration: 2000, color: 'success'
                    });
                    await toast.present();
                    // Force dashboard to refresh with timestamp
                    this.router.navigate(['/admin/dashboard'], {
                        queryParams: { refresh: new Date().getTime() }
                    });
                } else {
                    const alert = await this.alertCtrl.create({ header: 'Gagal', message: res.message, buttons: ['OK'] });
                    await alert.present();
                }
            },
            error: async (err) => {
                loading.dismiss();
                const alert = await this.alertCtrl.create({ header: 'Error', message: 'Koneksi gagal', buttons: ['OK'] });
                await alert.present();
            }
        });
    }
}
