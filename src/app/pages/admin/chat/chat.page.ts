import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService, ChatMessage } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { IonContent } from '@ionic/angular';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    standalone: false
})
export class ChatPage implements OnInit, OnDestroy {
    @ViewChild(IonContent) content: IonContent | undefined;

    studentId: number = 0;
    studentName: string = 'Siswa';
    messages: ChatMessage[] = [];
    newMessage = '';
    currentAdmin: any = null;
    refreshInterval: any;
    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private chatService: ChatService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.studentId = Number(this.route.snapshot.paramMap.get('studentId'));
        this.currentAdmin = this.authService.getCurrentUser();

        if (this.currentAdmin && this.studentId) {
            this.loadMessages();
            // Poll new messages every 5 seconds
            this.refreshInterval = setInterval(() => {
                this.loadMessages();
            }, 5000);
        }
    }

    ngOnDestroy() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
    }

    ionViewWillEnter() {
        setTimeout(() => this.scrollToBottom(), 300);
    }

    loadMessages() {
        if (!this.studentId) return;

        this.chatService.getMessages(this.studentId).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.messages = res.data;
                    // Get student name from first message if available
                    if (this.messages.length > 0 && this.messages[0].student_name) {
                        this.studentName = this.messages[0].student_name;
                    }
                }
            },
            error: (err: any) => {
                console.error('Error loading messages:', err);
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || !this.studentId) return;

        const msg = this.newMessage;
        this.newMessage = ''; // clear input immediately

        this.chatService.sendMessage(this.studentId, msg, 'admin').subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.loadMessages();
                    setTimeout(() => this.scrollToBottom(), 100);
                } else {
                    console.error('Failed to send message');
                }
            },
            error: (err: any) => {
                console.error('Error sending message:', err);
            }
        });
    }

    scrollToBottom() {
        if (this.content) {
            this.content.scrollToBottom(300);
        }
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}
