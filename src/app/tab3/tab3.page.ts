import { Component, OnInit } from '@angular/core';
import { PendaftaranService, PendaftaranItem } from '../services/pendaftaran.service';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  pendaftaranList: PendaftaranItem[] = [];
  isLoading = false;

  constructor(
    private pendaftaranService: PendaftaranService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.pendaftaranService.getPendaftaranByUserId(user.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.pendaftaranList = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          this.pendaftaranList = [];
        }
      },
      error: async (err) => {
        this.isLoading = false;
        console.error('Failed to load history', err);
        // Silent error or small toast
      }
    });
  }

  doRefresh(event: any) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      event.target.complete();
      return;
    }

    this.pendaftaranService.getPendaftaranByUserId(user.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pendaftaranList = Array.isArray(response.data) ? response.data : [response.data];
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'rejected': return 'danger';
      case 'pending_payment': return 'warning';
      default: return 'medium';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Aktif';
      case 'rejected': return 'Ditolak';
      case 'pending_payment': return 'Menunggu Pembayaran';
      case 'verification': return 'Sedang Diverifikasi';
      default: return status;
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  async selectFile(id: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.uploadProof(id, file);
      }
    };
    input.click();
  }

  async uploadProof(id: number, file: File) {
    const loading = await this.loadingCtrl.create({
      message: 'Mengupload bukti...',
    });
    await loading.present();

    this.pendaftaranService.uploadPaymentProof(id, file).subscribe({
      next: async (res) => {
        loading.dismiss();
        if (res.success) {
          const alert = await this.alertCtrl.create({
            header: 'Berhasil',
            message: 'Bukti pembayaran berhasil diupload. Admin akan segera memverifikasi.',
            buttons: ['OK']
          });
          await alert.present();
          this.loadData();
        } else {
          // Fallback for success=false in 200 OK
          const alert = await this.alertCtrl.create({
            header: 'Gagal',
            message: res.message || 'Gagal upload',
            buttons: ['OK']
          });
          await alert.present();
        }
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Gagal',
          message: 'Terjadi kesalahan saat upload.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async cancelRegistration(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Batalkan Pendaftaran?',
      message: 'Apakah Anda yakin ingin membatalkan pendaftaran ini? Data yang dihapus tidak dapat dikembalikan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Ya, Hapus',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Menghapus...' });
            await loading.present();

            this.pendaftaranService.cancelPendaftaran(id).subscribe({
              next: async (res) => {
                await loading.dismiss();
                if (res.success) {
                  this.loadData();
                } else {
                  const alertErr = await this.alertCtrl.create({
                    header: 'Gagal',
                    message: res.message || 'Gagal menghapus pendaftaran',
                    buttons: ['OK']
                  });
                  await alertErr.present();
                }
              },
              error: async () => {
                await loading.dismiss();
                const alertErr = await this.alertCtrl.create({
                  header: 'Error',
                  message: 'Gagal menghubungi server',
                  buttons: ['OK']
                });
                await alertErr.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
