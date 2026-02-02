import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Package {
    id?: number;
    name: string;
    description: string;
    price: number;
    subjects: string;
    level: string;
    duration: string;
    isActive: boolean;
}

export interface PackageResponse {
    success: boolean;
    message?: string;
    data?: Package[] | Package;
}

@Injectable({
    providedIn: 'root'
})
export class PackagesService {
    private apiUrl = environment.apiUrl || 'https://maribelajar.rplbc-23.com/api-maribelajar';
    private endpoint = '';

    // Event emitter to notify when packages are updated
    packageUpdated = new EventEmitter<void>();

    constructor(private http: HttpClient) {
        // Check if we are using the PHP API (XAMPP) which ends in .php
        // Check for common patterns: 'maribelajar-api', '127.0.0.1', 'localhost'
        const isPhpApi = this.apiUrl.includes('maribelajar') ||
            this.apiUrl.includes('maribelajar.rplbc-23.com') ||
            this.apiUrl.includes('maribelajar.rplbc-23.com');

        if (isPhpApi) {
            this.endpoint = `${this.apiUrl}/api-packages.php`;
        } else {
            // Fallback for REST API (Node/Laravel)
            this.endpoint = `${this.apiUrl}/packages`;
        }

        console.log('PackagesService initialized with endpoint:', this.endpoint);
    }

    getPackages(showAll: boolean = false): Observable<PackageResponse> {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const baseUrl = showAll ? `${this.endpoint}?admin=true` : this.endpoint;
        const url = baseUrl.includes('?') ? `${baseUrl}&_t=${timestamp}` : `${baseUrl}?_t=${timestamp}`;
        return this.http.get<PackageResponse>(url);
    }

    getPackageById(id: number): Observable<PackageResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<PackageResponse>(`${this.endpoint}?id=${id}&_t=${timestamp}`);
    }

    createPackage(pkg: Package): Observable<PackageResponse> {
        return this.http.post<PackageResponse>(this.endpoint, pkg).pipe(
            tap((res: PackageResponse) => {
                if (res.success) {
                    this.packageUpdated.emit();
                }
            })
        );
    }

    updatePackage(id: number, pkg: Package): Observable<PackageResponse> {
        // Ensure isActive is boolean or number as API expects
        return this.http.put<PackageResponse>(`${this.endpoint}?id=${id}`, pkg).pipe(
            tap((res: PackageResponse) => {
                if (res.success) {
                    this.packageUpdated.emit();
                }
            })
        );
    }

    deletePackage(id: number): Observable<PackageResponse> {
        return this.http.delete<PackageResponse>(`${this.endpoint}?id=${id}`).pipe(
            tap((res: PackageResponse) => {
                if (res.success) {
                    this.packageUpdated.emit();
                }
            })
        );
    }
}
