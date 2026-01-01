import { Component, Input, OnChanges, OnDestroy, ViewChild, ElementRef, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/conversation.model';
import { ChatMessage, MessageType } from '../../models/chat-message.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-conversation-box',
  templateUrl: './conversation-box.component.html',
  styleUrls: ['./conversation-box.component.css'],
  standalone: false
})
export class ConversationBoxComponent implements  OnInit, OnChanges, OnDestroy {
  @Input() conversation!: Conversation; // <--- Contains Messages already!

  currentUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  fileBaseUrl: string = '';
  isUploading: boolean = false;

  private chatSub: Subscription | undefined;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private api: ApiService,
  ) {
    this.currentUser = this.userService.currentUserValue;
    this.fileBaseUrl = this.api.baseUrl + '/Chat';
    
  }
    ngOnInit(): void {
      this.listenForMessages();
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && this.conversation) {

      // 1. OPTIMIZATION: Load messages directly from Input
      // No need for an API call here.
      if (this.conversation.messages) {
        this.messages = this.conversation.messages.map(m => this.mapToUi(m));
      } else {
        this.messages = [];
      }

      this.scrollToBottom();

    }
  }

  ngOnDestroy() {
    if (this.chatSub) this.chatSub.unsubscribe();
  }

  // --- GETTERS ---
  get receiverId(): string {
    if (this.conversation.isGroup) return this.conversation.id;
    const other = this.conversation.participants.find(p => p.id !== this.currentUser.id);
    return other ? other.id : '';
  }

  get chatTitle(): string {
    if (this.conversation.isGroup) return this.conversation.groupName || 'Group Chat';
    const other = this.conversation.participants.find(p => p.id !== this.currentUser.id);
    return other ? other.username : 'Unknown';
  }

  // --- REAL-TIME LOGIC ---
  listenForMessages() {
    this.chatSub = this.chatService.messageReceived$.subscribe((msg: ChatMessage | null) => {
      if (msg) this.handleNewMessage(msg);
    });
  }

  handleNewMessage(msg: ChatMessage) {
    let isRelevant = false;

    if (this.conversation.isGroup) {
      isRelevant = (msg.receiverId === this.conversation.id);
    } else {
      const targetId = this.receiverId;
      isRelevant =
        (msg.senderId === this.currentUser.id && msg.receiverId === targetId) ||
        (msg.senderId === targetId && msg.receiverId === this.currentUser.id);
    }

    if (isRelevant) {
      // Add to UI
      this.messages.push(this.mapToUi(msg));

      // OPTIONAL: Update the local conversation object too, so if we switch tabs and back, it's there
      // (This acts as a local cache update)
      if (!this.conversation.messages) this.conversation.messages = [];
      this.conversation.messages.push(msg);

      this.scrollToBottom();
      this.cdr.detectChanges();
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(
      this.conversation.id,   // 1. Conversation ID (Group or Private ID)
      this.currentUser.id,    // 2. Sender
      this.receiverId,        // 3. Receiver (Friend ID or Group ID)
      this.newMessage         // 4. Content
    );

    this.newMessage = '';
  }

  private mapToUi(msg: ChatMessage) {
    // Lookup the user in the participants list
    const senderUser = this.conversation.participants.find(p => p.id === msg.senderId);

    return {
      id: msg.id,
      sender: msg.senderId === this.currentUser.id ? 'me' : 'them',
      text: msg.content,
      type: msg.type,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      senderName: senderUser ? senderUser.username : 'Unknown'
    };
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try { this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; }
      catch (err) { }
    }, 100);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploadAndSend(file);
    }
  }

  uploadAndSend(file: File) {
    this.isUploading = true;

    this.api.uploadFile(file).subscribe({
      next: (response) => {
        this.isUploading = false;

        const fileUrl = response.url;

        this.chatService.sendMessage(
          this.conversation.id,
          this.currentUser.id,
          this.receiverId,
          fileUrl,
          MessageType.Image
        );
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isUploading = false;
      }
    });
  }

  downloadImage(imageUrl: string, fileName: string) {
    this.api.downloadImage(imageUrl).subscribe({
      next: (blob: Blob) => {
        // Create a temporary URL for the blob
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = fileName; // This forces the name and the download action
        a.click();

        // Cleanup to free memory
        URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Download failed', err);
        // Fallback: If blob fails (e.g. CORS), try opening in new tab
        window.open(imageUrl, '_blank');
      }
    });
  }
}
