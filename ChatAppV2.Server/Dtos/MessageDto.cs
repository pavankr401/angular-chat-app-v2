namespace ChatAppV2.Server.Dtos
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }

        // Expose as String for easier Frontend handling ("Text", "Image")
        public string Type { get; set; } = "Text";
    }
}
