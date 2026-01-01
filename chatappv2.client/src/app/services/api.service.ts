import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Point to the root API
  public readonly baseUrl = 'https://localhost:7042/api';
  public readonly apiUrl = `${this.baseUrl}`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // USER ENDPOINTS (/api/User)
  // ==========================================

  register(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/login`, credentials);
  }

  searchUser(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/User/search/${email}`);
  }

  // ==========================================
  // FRIEND ENDPOINTS (/api/Friend)
  // ==========================================

  // 1. Send a Friend Request
  // Consistent Naming: inviterId = Me (Sender), inviteeId = Friend (Receiver)
  addFriend(inviterId: string, inviteeId: string): Observable<any> {
    const payload = {
      senderId: inviterId,   // Maps to FriendRequestDto.UserId (Sender)
      receiverId: inviteeId  // Maps to FriendRequestDto.FriendId (Receiver)
    };
    return this.http.post(`${this.apiUrl}/Friend/add`, payload);
  }

  // 2. Get Pending Requests (People who added me)
  getRequests(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Friend/requests/${userId}`);
  }

  // 3. Get My Friends List
  getFriends(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Friend/list/${userId}`);
  }

  // 4. Accept or Reject a Request
  // Consistent Naming: inviterId = Original Sender, inviteeId = Me (Receiver)
  respondToRequest(inviterId: string, inviteeId: string, accept: boolean): Observable<any> {
    const payload = {
      inviterId: inviterId, // Must match RespondRequestDto.InviterId
      inviteeId: inviteeId, // Must match RespondRequestDto.InviteeId
      accept: accept
    };
    return this.http.post(`${this.apiUrl}/Friend/respond`, payload);
  }

  getSuggestions(userId: string): Observable<any> {
    // Changed path from /User/suggestions to /Friend/suggestions
    return this.http.get(`${this.apiUrl}/Friend/suggestions/${userId}`);
  }

  getChatHistory(user1Id: string, user2Id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Chat/history/${user1Id}/${user2Id}`);
  }

  getInbox(userId: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/Chat/inbox/${userId}`);
  }

  getConversation(user1Id: string, user2Id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/Chat/conversation/${user1Id}/${user2Id}`);
  }

  createGroup(creatorId: string, groupName: string, memberIds: string[]): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/Chat/create-group`, {
      creatorId,
      groupName,
      memberIds
    });
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/Chat/upload`, formData);
  }

  downloadImage(fileUrl: string) {
    // vital: responseType must be 'blob'
    return this.http.get(fileUrl, {
      responseType: 'blob'
    });
  }
}
