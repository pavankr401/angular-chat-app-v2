using ChatAppV2.Server.Dtos;
using ChatAppV2.Server.Hubs;
using ChatAppV2.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(ChatService chatService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _hubContext = hubContext;
        }

        [HttpGet("history/{user1Id}/{user2Id}")]
        public IActionResult GetHistory(Guid user1Id, Guid user2Id)
        {
            // 1. Get the Conversation Object
            var conversation = _chatService.GetOrCreateConversation(user1Id, user2Id);

            // 2. Access the Messages List inside it
            var messages = conversation.Messages;

            // 3. Map to DTOs
            var dtos = messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,

                // LOGIC FIX: Calculate ReceiverId dynamically
                // If Sender is User1, Receiver must be User2 (and vice versa)
                ReceiverId = (m.SenderId == user1Id) ? user2Id : user1Id,

                Content = m.Content,
                Timestamp = m.Timestamp,
                Type = m.Type.ToString()
            });

            return Ok(dtos);
        }

        [HttpGet("conversation/{user1Id}/{user2Id}")]
        public IActionResult GetConversationDto(Guid user1Id, Guid user2Id)
        {
            var conversation = _chatService.GetOrCreateConversation(user1Id, user2Id);

            // CLEAN: One line mapping
            return Ok(new ConversationDTO(conversation));
        }

        [HttpGet("inbox/{userId}")]
        public IActionResult GetInbox(Guid userId)
        {
            var conversations = _chatService.GetUserInbox(userId);

            // CLEAN: Just pass the object to the constructor
            var dtos = conversations.Select(c => new ConversationDTO(c));

            return Ok(dtos);
        }

        [HttpPost("create-group")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var conversation = _chatService.GetOrCreateGroup(request.CreatorId, request.GroupName, request.MemberIds);

            var dto = new ConversationDTO(conversation);

            foreach (var participant in conversation.Participants)
            {
                await _hubContext.Clients.Group(participant.Id.ToString())
                                     .SendAsync("NewConversation", dto);
            }

            return Ok(dto);
        }

        [HttpGet("uploads/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var fileBytes = System.IO.File.ReadAllBytes(filePath);

            // This allows the image to be displayed in the browser/img tag
            return File(fileBytes, "image/jpeg");
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // 1. Create unique filename
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // 2. Define path: wwwroot/uploads
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);

            // 3. Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 4. Return the Public URL
            // Assumption: Server is running on localhost (e.g., https://localhost:7152)
            // The client will prepend the API base URL if needed, or we return relative path.
            // Let's return the relative path for flexibility.
            var fileUrl = $"/uploads/{fileName}";

            return Ok(new { url = fileUrl });
        }
    }
}