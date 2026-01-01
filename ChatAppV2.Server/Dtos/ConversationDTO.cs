using ChatAppV2.Server.Models;

namespace ChatAppV2.Server.Dtos
{
    public class ConversationDTO: Conversation

    {
        public new List<UserDTO> Participants { get; set; } = new();

        public ConversationDTO(Conversation source)
        {
            Id = source.Id;
            IsGroup = source.IsGroup;
            GroupName = source.GroupName;
            LastActivity = source.LastActivity;
            LastMessagePreview = source.LastMessagePreview;
            LastMessageSenderId = source.LastMessageSenderId;

            // Map Participants (User -> UserDTO)
            Participants = source.Participants.Select(p => new UserDTO
            {
                Id = p.Id,
                Username = p.Username,
                Email = p.Email
            }).ToList();

            // Map Messages
            // We create a new list to ensure the DTO has its own collection
            Messages = source.Messages.ToList();
        }

        // Default constructor (required for some serializers)
        public ConversationDTO() { }

    }


}
