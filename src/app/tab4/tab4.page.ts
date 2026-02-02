import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, ChatMessage } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent | undefined;

  segment: 'faq' | 'chat' = 'faq';

  // FAQ Data
  faqs = [
    { question: 'Bagaimana cara mendaftar?', answer: 'Pilih paket di menu Pendaftaran (Tab 2), isi form, dan lakukan pembayaran.' },
    { question: 'Berapa lama verifikasi pembayaran?', answer: 'Verifikasi biasanya memakan waktu 1x24 jam kerja.' },
    { question: 'Apakah bisa ganti jadwal?', answer: 'Bisa, silakan hubungi admin melalui Live Chat untuk perubahan jadwal.' },
    { question: 'Metode pembayaran apa saja?', answer: 'Kami menerima transfer BCA, Mandiri, BRI, dan E-Wallet (OVO/GoPay).' }
  ];

  // Chat Data
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUser: any = null;
  userAvatar: string = '';
  refreshInterval: any;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userAvatar = this.currentUser.avatar_url || '';
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
    this.scrollToBottom();
  }

  loadMessages() {
    if (!this.currentUser) return;

    this.chatService.getMessages(this.currentUser.id).subscribe(res => {
      if (res.success) {
        this.messages = res.data;
        // Scroll to bottom only if user is actively chatting (simple logic)
        // ideally compare length
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentUser) return;

    const msg = this.newMessage;
    this.newMessage = ''; // clear input immediately

    this.chatService.sendMessage(this.currentUser.id, msg, 'user').subscribe({
      next: (res) => {
        if (res.success) {
          this.loadMessages();
          this.scrollToBottom();
        } else {
          // restore if failed?
        }
      },
      error: () => {
        // handle error
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content) this.content.scrollToBottom(300);
    }, 100);
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    if (this.segment === 'chat') {
      this.scrollToBottom();
    }
  }
}

