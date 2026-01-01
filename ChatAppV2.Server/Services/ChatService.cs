using ChatAppV2.Server.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ChatAppV2.Server.Services
{
    public class ChatService
    {
        // 1. Shared Inbox (History)
        private readonly ConcurrentDictionary<Guid, List<Conversation>> _userInbox = new();

        // 2. Online Status Tracking
        // Key: UserId (Guid), Value: Count of open tabs
        private readonly ConcurrentDictionary<Guid, int> _activeConnections = new();

        // Reverse Lookup: ConnectionId -> UserId (Needed for OnDisconnected)
        private readonly ConcurrentDictionary<string, Guid> _connectionToUserMap = new();

        private readonly UserService _userService;

        public ChatService(UserService userService)
        {
            _userService = userService;
        }

        // --- CORE CONVERSATION LOGIC ---

        public Conversation GetOrCreateConversation(Guid senderId, Guid receiverId)
        {
            var senderInbox = _userInbox.GetOrAdd(senderId, _ => new List<Conversation>());

            // Search for existing 1-on-1 chat
            var existingConv = senderInbox.FirstOrDefault(c =>
                !c.IsGroup && c.Participants.Any(p => p.Id == receiverId));

            if (existingConv != null) return existingConv;

            // Create New
            var sender = _userService.UsersById.GetValueOrDefault(senderId);
            var receiver = _userService.UsersById.GetValueOrDefault(receiverId);
            if (sender == null || receiver == null) throw new Exception("User not found");

            var newConv = new Conversation
            {
                Participants = new List<User> { sender, receiver },
                LastActivity = DateTime.UtcNow
            };

            // Add to both inboxes
            senderInbox.Add(newConv);
            var receiverInbox = _userInbox.GetOrAdd(receiverId, _ => new List<Conversation>());
            receiverInbox.Add(newConv);

            return newConv;
        }

        public ChatMessage? AddMessage(Guid conversationId, Guid senderId, Guid receiverId, string content, MessageType type = MessageType.Text)
        {
            if (!_userInbox.TryGetValue(senderId, out var inbox)) return null;
            var conversation = inbox.FirstOrDefault(c => c.Id == conversationId);
            if (conversation == null) return null;

            var msg = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                Type = type,
                Timestamp = DateTime.UtcNow
            };

            lock (conversation)
            {
                conversation.Messages.Add(msg);
                conversation.LastActivity = DateTime.UtcNow;
                conversation.LastMessageSenderId = senderId;
                conversation.LastMessagePreview = type == MessageType.Text ? content : "Attachment";
            }

            return msg;
        }

        // --- NEW: ONLINE STATUS LOGIC (From Reference) ---

        public void MarkUserConnected(Guid userId, string connectionId)
        {
            // Increment tab count
            _activeConnections.AddOrUpdate(userId, 1, (k, count) => count + 1);
            _connectionToUserMap[connectionId] = userId;
        }

        public Guid? MarkUserDisconnected(string connectionId)
        {
            if (_connectionToUserMap.TryRemove(connectionId, out Guid userId))
            {
                // Decrement tab count. If 0, they are truly offline.
                _activeConnections.AddOrUpdate(userId, 0, (k, count) => count > 0 ? count - 1 : 0);
                return userId;
            }
            return null;
        }

        public bool IsUserOnline(Guid userId)
        {
            return _activeConnections.TryGetValue(userId, out int count) && count > 0;
        }

        public List<Conversation> GetUserInbox(Guid userId)
        {
            // Try to get the user's inbox list from the dictionary
            if (_userInbox.TryGetValue(userId, out var conversations))
            {
                // Return them ordered by most recent activity (Newest first)
                return conversations
                    .OrderByDescending(c => c.LastActivity)
                    .ToList();
            }

            // If they have no chats yet, return an empty list
            return new List<Conversation>();
        }

        public Conversation GetOrCreateGroup(Guid creatorId, string groupName, List<Guid> memberIds)
        {
            var conversation = new Conversation
            {
                IsGroup = true,
                GroupName = groupName,
                LastActivity = DateTime.UtcNow,
                LastMessagePreview = "Group created"
            };

            // 1. Find and Add Creator to the Group
            var creator = _userService.UsersById.Values.FirstOrDefault(u => u.Id == creatorId);
            if (creator != null) conversation.Participants.Add(creator);

            // 2. Find and Add Members to the Group
            foreach (var id in memberIds)
            {
                var user = _userService.UsersById.Values.FirstOrDefault(u => u.Id == id);
                if (user != null && !conversation.Participants.Contains(user))
                {
                    conversation.Participants.Add(user);
                }
            }

            // 3. CRITICAL FIX: "Fan-out" the conversation to every participant's inbox
            foreach (var participant in conversation.Participants)
            {
                // Get the specific user's inbox (or create one if they are new)
                var userInbox = _userInbox.GetOrAdd(participant.Id, _ => new List<Conversation>());

                // Add the reference to this group conversation
                userInbox.Add(conversation);
            }

            return conversation;
        }

        public List<User>? GetParticipants(Guid conversationId, Guid userId)
        {
            // 1. Look up the requester's inbox to find the conversation reference
            if (_userInbox.TryGetValue(userId, out var inbox))
            {
                // 2. Find the specific conversation object
                var conversation = inbox.FirstOrDefault(c => c.Id == conversationId);

                // 3. Return the shared participants list
                // (Since this is a reference type, it includes everyone currently in the group)
                return conversation?.Participants;
            }

            return null;
        }

    }
}