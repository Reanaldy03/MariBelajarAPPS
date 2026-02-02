import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ChatMessage {
    id: number;
    user_id: number;
    sender_role: 'user' | 'admin' | 'siswa';
    message: string;
    created_at: string;
    student_name?: string;
    is_read?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Hardcoded for now, ideally reused from AuthService or environment
    private apiUrl = 'https://maribelajar.rplbc-23.com/api-maribelajar';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getMessages(userId: number): Observable<{ success: boolean; data: ChatMessage[] }> {
        return this.http.get<{ success: boolean; data: ChatMessage[] }>(
            `${this.apiUrl}/api-chat.php?user_id=${userId}`
        );
    }

    getAllChats(): Observable<{ success: boolean; data: any[] }> {
        return this.http.get<{ success: boolean; data: any[] }>(
            `${this.apiUrl}/api-chat.php?action=get_all_chats`
        );
    }

    sendMessage(userId: number, message: string, senderRole: 'user' | 'admin'): Observable<any> {
        return this.http.post(`${this.apiUrl}/api-chat.php`, {
            user_id: userId,
            sender_role: senderRole,
            message: message
        });
    }
}
