import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PendaftaranService, PendaftaranItem } from '../../../services/pendaftaran.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.page.html',
    styleUrls: ['./verification.page.scss'],
    standalone: false
})
export class VerificationPage implements OnInit {
    registrationId: number = 0;
    data: PendaftaranItem | null = null;
    isLoading = true;
    protected window = window;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pendaftaranService: PendaftaranService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.registrationId = +id;
                this.loadData();
            }
        });
    }

    async loadData() {
        this.isLoading = true;
        this.pendaftaranService.getPendaftaranById(this.registrationId).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success && response.data) {
                    // data can be array or object depending on API, but getById usually returns single object in array or object
                    // Adjust based on your API response structure for single item
                    this.data = Array.isArray(response.data) ? response.data[0] : response.data;
                }
            },
            error: async (err) => {
                this.isLoading = false;
                const alert = await this.alertCtrl.create({
                    header: 'Error',
                    message: 'Gagal memuat data detail.',
                    buttons: ['OK']
                });
                await alert.present();
            }
        });
    }

    async verifyPayment() {
        const alert = await this.alertCtrl.create({
            header: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin memverifikasi pembayaran siswa ini? Status akan menjadi AKTIF.',
            buttons: [
                {
                    text: 'Batal',
                    role: 'cancel'
                },
                {
                    text: 'Ya, Verifikasi',
                    handler: () => {
                        this.updateStatus('active');
                    }
                }
            ]
        });
        await alert.present();
    }

    async rejectPayment() {
        const alert = await this.alertCtrl.create({
            header: 'Tolak Pendaftaran',
            inputs: [
                {
                    name: 'reason',
                    type: 'textarea',
                    placeholder: 'Alasan penolakan (opsional)'
                }
            ],
            buttons: [
                {
                    text: 'Batal',
                    role: 'cancel'
                },
                {
                    text: 'Tolak',
                    handler: (data) => {
                        this.updateStatus('rejected', data.reason);
                    }
                }
            ]
        });
        await alert.present();
    }

    async updateStatus(status: string, reason?: string) {
        const loading = await this.loadingCtrl.create({
            message: 'Memproses...',
        });
        await loading.present();

        this.pendaftaranService.updateStatus(this.registrationId, status, reason).subscribe({
            next: async (res) => {
                loading.dismiss();
                const toast = await this.toastCtrl.create({
                    message: 'Status berhasil diperbarui',
                    duration: 2000,
                    color: 'success'
                });
                await toast.present();
                this.loadData(); // Reload
            },
            error: async (err) => {
                loading.dismiss();
                const alert = await this.alertCtrl.create({
                    header: 'Gagal',
                    message: 'Gagal memperbarui status. Pastikan API sudah diupdate.',
                    buttons: ['OK']
                });
                await alert.present();
            }
        });
    }

    whatsapp() {
        if (this.data && this.data.nomorTelepon) {
            let phone = this.data.nomorTelepon;
            if (phone.startsWith('0')) {
                phone = '62' + phone.substring(1);
            }
            window.open(`https://wa.me/${phone}`, '_system');
        }
    }

    getImageUrl(path: string): string {
        if (!path) return '';

        // If path already contains full URL (from updated backend), use it directly
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        // Otherwise, construct full URL using environment apiUrl
        // environment.apiUrl is like 'https://maribelajar.rplbc-23.com/api-maribelajar'
        return `${environment.apiUrl}/${path}`;
    }
}
