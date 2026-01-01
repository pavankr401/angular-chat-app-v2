namespace ChatAppV2.Server.Models
{
    public enum MessageType
    {
        Text = 0,
        Image = 1,
        File = 2,
        System = 3 // Good for "User joined the chat" messages
    }
}
