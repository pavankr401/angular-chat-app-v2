namespace ChatAppV2.Server.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; } // Storing as plain text for this demo
    }
}
