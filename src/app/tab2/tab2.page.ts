// Tab2Page: Handles Student Registration and Package Selection
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PendaftaranService } from '../services/pendaftaran.service';
import { AuthService } from '../services/auth.service';
import { PackagesService, Package } from '../services/packages.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  packages: any[] = [];
  filteredPackages: any[] = [];
  activeCategory: string = '';
  searchQuery: string = '';
  categories: string[] = [
    'Matematika',
    'B. Inggris',
    'Sains',
    'Komputer',
    'Musik',
    'Seni',
    'Ekonomi',
    'Sejarah'
  ];
  viewMode: 'list' | 'form' | 'payment' = 'list';
  selectedPackage: any = null;
  registrationId: number | null = null;
  selectedFile: File | null = null;

  pendaftaranForm: FormGroup;
  // ... imports and constructor ...

  // ... existing methods ...

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadPayment() {
    if (!this.selectedFile || !this.registrationId) {
      this.showToast('Pilih file bukti pembayaran terlebih dahulu', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mengupload bukti pembayaran...'
    });
    await loading.present();

    this.pendaftaranService.uploadPaymentProof(this.registrationId, this.selectedFile).subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res.success) {
          const alert = await this.alertController.create({
            header: 'Pembayaran Diterima',
            message: 'Terima kasih! Bukti pembayaran Anda sedang diverifikasi. Cek status pendaftaran di Tab "Daftar Siswa".',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.resetAll();
                this.router.navigate(['/tabs/tab3']);
              }
            }]
          });
          await alert.present();
        } else {
          this.showToast(res.message || 'Gagal upload', 'danger');
        }
      },
      error: async (err) => {
        await loading.dismiss();
        this.showToast('Gagal mengupload bukti pembayaran', 'danger');
      }
    });
  }

  resetAll() {
    this.pendaftaranForm.reset();
    this.viewMode = 'list';
    this.selectedPackage = null;
    this.registrationId = null;
    this.selectedFile = null;
  }

  // Update showToast to be public if not already or use the existing calls
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message, duration: 2000, color, position: 'top'
    });
    await toast.present();
  }

  // MODIFIED onSubmit (Partial Replacement for context)
  async onSubmit() {
    if (this.pendaftaranForm.invalid) {
      // ... existing validation ...
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingController.create({ message: 'Memproses pendaftaran...' });
    await loading.present();

    try {
      const formData = this.pendaftaranForm.value;
      const user = this.authService.getCurrentUser();
      if (user) { formData.userId = user.id; }
      if (this.selectedPackage) {
        formData.packageId = this.selectedPackage.id;
        formData.paket = this.selectedPackage.name;
      }

      const response = await firstValueFrom(this.pendaftaranService.submitPendaftaran(formData)) as any;
      await loading.dismiss();
      this.isSubmitting = false;

      if (response && response.success) {
        // SUCCESS: Switch to Payment Mode
        this.registrationId = response.data.id;
        this.viewMode = 'payment';

        // Optional: Show brief toast
        // this.showToast('Data tersimpan, silakan lakukan pembayaran', 'success');
      } else {
        // ... error handling ...
        this.showToast('Gagal mendaftar', 'danger');
      }

    } catch (error: any) {
      await loading.dismiss();
      this.isSubmitting = false;
      // ... existing error handling ...
      this.showToast('Terjadi kesalahan', 'danger');
    }
  }
  isProposedDateInvalid: boolean = false;
  isSubmitting: boolean = false;

  // Validation constraints
  maxMataPelajaran: number = 3; // Default fallback

  constructor(
    private fb: FormBuilder,
    private pendaftaranService: PendaftaranService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController, // Added missing injection
    private router: Router,
    private route: ActivatedRoute, // Inject Route
    private authService: AuthService,
    private packagesService: PackagesService
  ) {
    this.pendaftaranForm = this.fb.group({
      namaSiswa: ['', [Validators.required]],
      nomorTelepon: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      mataPelajaran: ['', [Validators.required]],
      tingkatPendidikan: ['', [Validators.required]],
      jadwalPilihan: ['', [Validators.required]],
      metodePembelajaran: ['', [Validators.required]],
      // paket: removed from form control access via simple binding or keep as hidden
      programKhusus: ['']
    });
  }

  ngOnInit() {
    this.fetchPackages();
  }

  ionViewWillEnter() {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.activeCategory = params['category'];
      } else {
        this.activeCategory = '';
      }
      this.fetchPackages();
    });
  }

  fetchPackages() {
    this.packagesService.getPackages(false).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.packages = res.data;
          this.filterPackages(); // Apply filter after fetch
        }
      },
      error: (err) => {
        console.error('Failed to load packages', err);
      }
    });
  }

  filterPackages() {
    let filtered = [...this.packages];

    // Filter by category
    if (this.activeCategory) {
      filtered = filtered.filter(pkg =>
        pkg.subjects && pkg.subjects.toLowerCase().includes(this.activeCategory.toLowerCase())
      );
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(pkg =>
        (pkg.name && pkg.name.toLowerCase().includes(query)) ||
        (pkg.subjects && pkg.subjects.toLowerCase().includes(query)) ||
        (pkg.level && pkg.level.toLowerCase().includes(query))
      );
    }

    this.filteredPackages = filtered;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value || '';
    this.filterPackages();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterPackages();
  }

  selectCategory(category: string) {
    this.activeCategory = category;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category },
      queryParamsHandling: 'merge'
    });
    this.filterPackages();
  }

  clearFilter() {
    this.activeCategory = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
    this.filterPackages();
  }

  selectPackage(pkg: any) {
    this.selectedPackage = pkg;
    this.viewMode = 'form';

    // Auto-fill level if available
    if (pkg.level) {
      this.pendaftaranForm.patchValue({
        tingkatPendidikan: pkg.level
      });
    }

    // Auto-fill User Data
    const user = this.authService.getCurrentUser();
    if (user) {
      this.pendaftaranForm.patchValue({
        namaSiswa: user.full_name,
        nomorTelepon: user.phone || ''
      });
    }

    this.updateMataPelajaranValidation();
  }

  cancelRegistration() {
    this.viewMode = 'list';
    this.selectedPackage = null;
    this.pendaftaranForm.reset();
  }

  async showPackageSelectedToast(paketName: string) {
    const toast = await this.toastController.create({
      message: `${paketName} telah dipilih`,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  formatPrice(price: any): string {
    if (!price) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  }

  getMataPelajaranHint(): string {
    return 'Pilih mata pelajaran';
  }

  // Removed unused initializeForm method that was causing errors with registrationForm

  validateMataPelajaran(control: any) {
    // Simplified validation since logic is now handled in component methods
    const selectedMataPelajaran = control.value || [];

    if (selectedMataPelajaran.length === 0) {
      return { required: true };
    }
    return null;
  }

  updateMataPelajaranValidation(pkg?: Package) {
    const mataPelajaranControl = this.pendaftaranForm.get('mataPelajaran');
    if (mataPelajaranControl) {
      if (!pkg && !this.selectedPackage) {
        mataPelajaranControl.setValue([]);
      }
      // Manual re-evaluation can happen here if needed
    }
  }

  onMataPelajaranChange(event: any) {
    if (!this.selectedPackage) return;

    // Relaxed validation for dynamic packages
    const max = 5;
    const selectedValues = event.detail.value || []; // This might be single string if not multiple="true"

    // If input is text, no validation needed like array
    // Assuming input[type=text] for generic mapel
  }

  async showMaxSelectionToast(max: number) {
    const toast = await this.toastController.create({
      message: `Maksimal ${max} mata pelajaran`,
      duration: 2000,
      color: 'warning',
      position: 'top'
    });
    await toast.present();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.pendaftaranForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Helper for template
  isControlInvalid(controlName: string): boolean {
    return this.isFieldInvalid(controlName);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.pendaftaranForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Field ini wajib diisi';
      }
      if (field.errors['minlength']) {
        return 'Minimal 3 karakter';
      }
      if (field.errors['pattern']) {
        return 'Format nomor telepon tidak valid (contoh: 081234567890)';
      }
    }
    return '';
  }


}
