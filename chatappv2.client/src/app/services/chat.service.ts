import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage, MessageType } from '../models/chat-message.model';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);

  // Point to OUR backend port
  private baseUrl = 'https://localhost:7042';
  private apiUrl = `${this.baseUrl}/api/Chat`;
  private hubUrl = `${this.baseUrl}/chatHub`;

  public hubConnection: signalR.HubConnection;

  // Streams for Components to subscribe to
  public messageReceived$ = new Subject<ChatMessage | null>();
  public onlineStatus$ = new Subject<{ userId: string, isOnline: boolean }>();
  public newConversation$ = new Subject<Conversation>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl) // Using correct port
      .withAutomaticReconnect()
      .build();

    // 1. Listen for Incoming Messages
    this.hubConnection.on('ReceiveOne', (data: ChatMessage) => {
      this.messageReceived$.next(data);
    });

    // 2. Listen for Status Updates
    this.hubConnection.on('UserIsOnline', (userId: string) => {
      this.onlineStatus$.next({ userId, isOnline: true });
    });

    this.hubConnection.on('UserIsOffline', (userId: string) => {
      this.onlineStatus$.next({ userId, isOnline: false });
    });

    this.hubConnection.on('NewConversation', (conversation: Conversation) => {
      this.newConversation$.next(conversation);
    });
  }

  // --- CONNECTION MANAGEMENT ---

  public startConnection(userId: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.registerUser(userId);
      return;
    }

    this.hubConnection.start().then(() => {
      console.log('SignalR Connected');
      this.registerUser(userId);
    }).catch(err => console.error('SignalR Connection Error: ', err));
  }

  private registerUser(userId: string) {
    // Calls ChatHub.RegisterUser(string userId)
    this.hubConnection.invoke("RegisterUser", userId)
      .catch(err => console.error(err));
  }


  public sendMessage(conversationId: string, senderId: string, receiverId: string, content: string, type: MessageType = MessageType.Text){
    // Calls ChatHub.SendMessage(conversationId, senderId, receiverId, content)
    this.hubConnection.invoke("SendMessage", conversationId, senderId, receiverId, content, type)
      .catch(err => console.error(err));
  }

  public getHistory(myId: string, friendId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${myId}/${friendId}`);
  }
}
