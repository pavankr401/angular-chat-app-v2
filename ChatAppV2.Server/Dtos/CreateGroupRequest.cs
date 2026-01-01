namespace ChatAppV2.Server.Dtos
{
    public class CreateGroupRequest
    {
        public Guid CreatorId { get; set; } // Who is making the group?
        public string GroupName { get; set; } = "";
        public List<Guid> MemberIds { get; set; } = new();
    }
}
