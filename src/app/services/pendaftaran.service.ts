import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PendaftaranData {
  namaSiswa: string;
  nomorTelepon: string;
  mataPelajaran: string;
  tingkatPendidikan: string;
  jadwalPilihan: string;
  metodePembelajaran: string;
  paket: string;
  programKhusus?: string;
  userId?: number;
  packageId?: number;
}

export interface PendaftaranItem {
  id: number;
  namaSiswa: string;
  nomorTelepon: string;
  mataPelajaran: string;
  tingkatPendidikan: string;
  jadwalPilihan: string;
  metodePembelajaran: string;
  paket: string;
  programKhusus?: string;
  createdAt: string;
  status: string;
  paymentProof?: string;
  rejectionReason?: string;
}

export interface PendaftaranResponse {
  success: boolean;
  message: string;
  data?: PendaftaranItem | PendaftaranItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PendaftaranService {
  private apiUrl = environment.apiUrl || 'https://maribelajar.rplbc-23.com/api-maribelajar';

  constructor(private http: HttpClient) { }

  private isPhpApi(): boolean {
    return this.apiUrl.includes('maribelajar') ||
      this.apiUrl.includes('maribelajar.rplbc-23.com') ||
      this.apiUrl.includes('maribelajar.rplbc-23.com');
  }

  submitPendaftaran(data: PendaftaranData): Observable<PendaftaranResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php`
      : `${this.apiUrl}/pendaftaran`;

    return this.http.post<PendaftaranResponse>(
      endpoint,
      data,
      { headers }
    );
  }

  getAllPendaftaran(): Observable<PendaftaranResponse> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php`
      : `${this.apiUrl}/pendaftaran`;

    // Add timestamp to prevent caching  
    const timestamp = new Date().getTime();
    const url = endpoint.includes('?') ? `${endpoint}&_t=${timestamp}` : `${endpoint}?_t=${timestamp}`;

    return this.http.get<PendaftaranResponse>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    });
  }

  getPendaftaranByUserId(userId: number): Observable<PendaftaranResponse> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php?user_id=${userId}`
      : `${this.apiUrl}/pendaftaran?user_id=${userId}`;

    return this.http.get<PendaftaranResponse>(endpoint);
  }

  getPendaftaranById(id: number): Observable<PendaftaranResponse> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php?id=${id}`
      : `${this.apiUrl}/pendaftaran/${id}`;

    return this.http.get<PendaftaranResponse>(endpoint);
  }

  updateStatus(id: number, status: string, rejectionReason?: string): Observable<any> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php?id=${id}`
      : `${this.apiUrl}/pendaftaran/${id}`;

    const body: any = { status };
    if (rejectionReason) {
      body.rejectionReason = rejectionReason;
    }

    return this.http.put(endpoint, body);
  }

  uploadPaymentProof(id: number, file: File): Observable<any> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php?action=upload_payment`
      : `${this.apiUrl}/pendaftaran/${id}/upload`;

    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('payment_proof', file);

    return this.http.post(endpoint, formData);
  }

  cancelPendaftaran(id: number): Observable<any> {
    const endpoint = this.isPhpApi()
      ? `${this.apiUrl}/api-pendaftaran.php?id=${id}`
      : `${this.apiUrl}/pendaftaran/${id}`;

    return this.http.delete(endpoint);
  }
}

