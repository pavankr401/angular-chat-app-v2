namespace ChatAppV2.Server.Dtos
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? ProfileImage { get; set; }
    }
}
