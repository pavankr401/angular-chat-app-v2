namespace ChatAppV2.Server.Models
{
    public class Conversation
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Group Logic
        public bool IsGroup { get; set; }
        public string? GroupName { get; set; }

        // Shared Reference Logic: Holds actual User objects
        public virtual List<User> Participants { get; set; } = new();

        // Message History
        public List<ChatMessage> Messages { get; set; } = new();

        // Metadata for "Sort by Recent"
        public DateTime LastActivity { get; set; } = DateTime.UtcNow;
        public string LastMessagePreview { get; set; } = string.Empty;
        public Guid? LastMessageSenderId { get; set; }
    }
}