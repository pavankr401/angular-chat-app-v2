using Microsoft.AspNetCore.SignalR;
using ChatAppV2.Server.Services;
using ChatAppV2.Server.Models;
using System.Collections.Concurrent;

namespace ChatAppV2.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;

        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        // 1. REGISTER USER (Handle Online Presence)
        public async Task RegisterUser(string userIdStr)
        {
            if (Guid.TryParse(userIdStr, out Guid userId))
            {
                // A. Add this specific connection (tab) to the User's Personal Group
                await Groups.AddToGroupAsync(Context.ConnectionId, userIdStr);

                // B. Mark Online in Service (Increments tab count)
                _chatService.MarkUserConnected(userId, Context.ConnectionId);

                // C. Broadcast to EVERYONE that this user is online
                // (Only do this if this is their first tab, or just do it every time - keeping it simple)
                await Clients.All.SendAsync("UserIsOnline", userIdStr);
            }
        }

        // 2. DISCONNECT HANDLER
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // A. Mark Disconnected in Service (Decrements tab count)
            var userId = _chatService.MarkUserDisconnected(Context.ConnectionId);

            if (userId.HasValue)
            {
                // B. Only broadcast "UserIsOffline" if they have NO active tabs left
                if (!_chatService.IsUserOnline(userId.Value))
                {
                    await Clients.All.SendAsync("UserIsOffline", userId.Value.ToString());
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        // 3. SEND MESSAGE
        public async Task SendMessage(string conversationIdStr, string senderIdStr, string receiverIdStr, string content, int typeInt = 0)
        {
            if (!Guid.TryParse(conversationIdStr, out Guid conversationId) ||
                !Guid.TryParse(senderIdStr, out Guid senderId) ||
                !Guid.TryParse(receiverIdStr, out Guid receiverId)) return;

            var type = (MessageType)typeInt;
            var msg = _chatService.AddMessage(conversationId, senderId, receiverId, content, type);

            if (msg == null) return;

            var participants = _chatService.GetParticipants(conversationId, senderId);

            if (participants != null)
            {
                foreach (var user in participants)
                {
                    await Clients.Group(user.Id.ToString()).SendAsync("ReceiveOne", msg);
                }
            }
        }
    }
}