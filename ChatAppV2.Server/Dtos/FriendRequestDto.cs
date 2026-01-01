namespace ChatAppV2.Server.Dtos
{
    public class FriendRequestDto
    {
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
    }
}
