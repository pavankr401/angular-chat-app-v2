namespace ChatAppV2.Server.Dtos
{
    public class RespondRequestDto
    {
        public Guid InviterId { get; set; } // The Friend (Sender)
        public Guid InviteeId { get; set; } // Me (Receiver)
        public bool Accept { get; set; }    // True/False
    }
}
