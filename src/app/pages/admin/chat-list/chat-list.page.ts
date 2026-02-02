import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.page.html',
    styleUrls: ['./chat-list.page.scss'],
    standalone: false
})
export class ChatListPage implements OnInit {
    chatList: any[] = [];
    isLoading = false;

    constructor(
        private chatService: ChatService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadChats();
    }

    ionViewWillEnter() {
        this.loadChats();
    }

    loadChats() {
        this.isLoading = true;
        this.chatService.getAllChats().subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.success && response.data) {
                    // Group messages by student
                    const chatMap = new Map();
                    response.data.forEach((msg: any) => {
                        if (!chatMap.has(msg.student_id)) {
                            chatMap.set(msg.student_id, {
                                student_id: msg.student_id,
                                student_name: msg.student_name,
                                last_message: msg.message,
                                last_time: msg.created_at,
                                unread_count: msg.sender_role === 'user' ? 1 : 0
                            });
                        } else {
                            const existing = chatMap.get(msg.student_id);
                            if (new Date(msg.created_at) > new Date(existing.last_time)) {
                                existing.last_message = msg.message;
                                existing.last_time = msg.created_at;
                            }
                            if (msg.sender_role === 'user') {
                                existing.unread_count++;
                            }
                        }
                    });
                    this.chatList = Array.from(chatMap.values()).sort((a, b) =>
                        new Date(b.last_time).getTime() - new Date(a.last_time).getTime()
                    );
                }
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('Error loading chats:', err);
            }
        });
    }

    openChat(studentId: number) {
        this.router.navigate(['/admin/chat', studentId]);
    }

    doRefresh(event: any) {
        this.chatService.getAllChats().subscribe({
            next: (response: any) => {
                if (response.success && response.data) {
                    const chatMap = new Map();
                    response.data.forEach((msg: any) => {
                        if (!chatMap.has(msg.student_id)) {
                            chatMap.set(msg.student_id, {
                                student_id: msg.student_id,
                                student_name: msg.student_name,
                                last_message: msg.message,
                                last_time: msg.created_at,
                                unread_count: msg.sender_role === 'user' ? 1 : 0
                            });
                        } else {
                            const existing = chatMap.get(msg.student_id);
                            if (new Date(msg.created_at) > new Date(existing.last_time)) {
                                existing.last_message = msg.message;
                                existing.last_time = msg.created_at;
                            }
                            if (msg.sender_role === 'user' && !msg.is_read) {
                                existing.unread_count++;
                            }
                        }
                    });
                    this.chatList = Array.from(chatMap.values()).sort((a, b) =>
                        new Date(b.last_time).getTime() - new Date(a.last_time).getTime()
                    );
                }
                event.target.complete();
            },
            error: () => {
                event.target.complete();
            }
        });
    }

    getTimeAgo(timestamp: string): string {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now.getTime() - time.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} hari lalu`;

        return time.toLocaleDateString('id-ID');
    }
}
