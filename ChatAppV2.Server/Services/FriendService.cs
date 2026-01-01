using ChatAppV2.Server.Dtos;
using ChatAppV2.Server.Models;
using System.Collections.Concurrent;

namespace ChatAppV2.Server.Services
{
    public class FriendService
    {
        // Key: UserId (string), Value: List of their friendships
        public ConcurrentDictionary<string, List<Friendship>> Friendships { get; } = new();

        private readonly UserService _userService;

        public FriendService(UserService userService)
        {
            _userService = userService;
        }

        public string SendFriendRequest(Guid senderId, Guid receiverId)
        {
            // 1. Validation
            if (senderId == receiverId) return "Cannot add yourself";

            // 2. Lookup Users (Instant O(1) Lookup)
            // We try to get the values directly from the dictionary
            bool senderExists = _userService.UsersById.TryGetValue(senderId, out var sender);
            bool receiverExists = _userService.UsersById.TryGetValue(receiverId, out var receiver);

            if (!senderExists || !receiverExists || sender == null || receiver == null)
            {
                return "User not found";
            }

            // 3. Check for existing friendship
            string senderKey = senderId.ToString();
            string receiverKey = receiverId.ToString();

            var senderFriends = Friendships.GetOrAdd(senderKey, new List<Friendship>());

            bool alreadyExists = senderFriends.Any(f =>
                (f.InviterId == senderKey && f.InviteeId == receiverKey) ||
                (f.InviterId == receiverKey && f.InviteeId == senderKey));

            if (alreadyExists) return "Request already sent or you are already friends";

            // 4. Create Friendship
            var friendship = new Friendship
            {
                InviterId = senderKey,
                Inviter = sender,
                InviteeId = receiverKey,
                Invitee = receiver,
                Status = FriendshipStatus.Pending
            };

            // 5. Add to both
            Friendships.GetOrAdd(senderKey, new List<Friendship>()).Add(friendship);
            Friendships.GetOrAdd(receiverKey, new List<Friendship>()).Add(friendship);

            return "Success";
        }

        public bool RespondToRequest(Guid inviterId, Guid inviteeId, bool accept)
        {
            string inviterKey = inviterId.ToString();
            string inviteeKey = inviteeId.ToString();

            // The Invitee (Me) is the one responding, so the request is in MY list.
            // We look up the Invitee's list to find the friendship object.
            var friendship = Friendships.GetOrAdd(inviteeKey, new List<Friendship>())
                .FirstOrDefault(f =>
                    f.InviteeId == inviteeKey &&
                    f.InviterId == inviterKey &&
                    f.Status == FriendshipStatus.Pending
                );

            if (friendship == null) return false;

            if (accept)
            {
                friendship.Status = FriendshipStatus.Accepted;
            }
            else
            {
                // Remove from BOTH lists
                if (Friendships.TryGetValue(inviteeKey, out var myList)) myList.Remove(friendship);
                if (Friendships.TryGetValue(inviterKey, out var theirList)) theirList.Remove(friendship);
            }

            return true;
        }

        public List<UserDTO> GetPendingRequests(Guid userId)
        {
            string key = userId.ToString();

            // If I have no entry in the dictionary, return empty list
            if (!Friendships.ContainsKey(key)) return new List<UserDTO>();

            return Friendships[key]
                .Where(f => f.InviteeId == key && f.Status == FriendshipStatus.Pending)
                .Select(f => new UserDTO
                {
                    Id = f.Inviter.Id,
                    Username = f.Inviter.Username,
                    Email = f.Inviter.Email
                })
                .ToList();
        }

        // 2. Get my actual friends
        public List<UserDTO> GetFriendsList(Guid userId)
        {
            string key = userId.ToString();
            if (!Friendships.ContainsKey(key)) return new List<UserDTO>();

            return Friendships[key]
                .Where(f => f.Status == FriendshipStatus.Accepted)
                .Select(f =>
                {
                    // If I am the Inviter, show the Invitee. If I am Invitee, show Inviter.
                    var friend = (f.InviterId == key) ? f.Invitee : f.Inviter;
                    return new UserDTO
                    {
                        Id = friend.Id,
                        Username = friend.Username,
                        Email = friend.Email
                    };
                })
                .ToList();
        }
    }
}
