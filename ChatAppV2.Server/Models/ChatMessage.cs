namespace ChatAppV2.Server.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SenderId { get; set; } // LLD: String to match User.Id
        public Guid ReceiverId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Content Handling
        public MessageType Type { get; set; } = MessageType.Text;
        public string Content { get; set; } = "";// Text message or Caption
        public string? MediaUrl { get; set; } // URL to file
    }
}