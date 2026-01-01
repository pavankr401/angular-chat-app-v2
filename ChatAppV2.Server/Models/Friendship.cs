namespace ChatAppV2.Server.Models
{
    public class Friendship
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string InviterId { get; set; }
        public User Inviter { get; set; }

        public string InviteeId { get; set; } // The person receiving the request
        public User Invitee { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
