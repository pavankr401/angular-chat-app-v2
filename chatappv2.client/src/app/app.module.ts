import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { FriendRequestsComponent } from './components/friend-requests/friend-requests.component';
import { ViewFriendsComponent } from './components/view-friends/view-friends.component';
import { ManageFriendsComponent } from './components/manage-friends/manage-friends.component';
import { HomeComponent } from './components/home/home.component';
import { PrimitivesModule } from './primitives/primitives.module';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ConversationBoxComponent } from './components/conversation-box/conversation-box.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AddFriendComponent,
    FriendRequestsComponent,
    ViewFriendsComponent,
    ManageFriendsComponent,
    HomeComponent,
    HeaderComponent,
    ConversationBoxComponent,
    ConversationListComponent,
    CreateGroupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    PrimitivesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
