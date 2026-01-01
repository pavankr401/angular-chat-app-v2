using ChatAppV2.Server.Dtos;
using ChatAppV2.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendController : ControllerBase
    {
        private readonly FriendService _friendService;
        private readonly UserService _userService; // <--- Inject this

        // Update Constructor
        public FriendController(FriendService friendService, UserService userService)
        {
            _friendService = friendService;
            _userService = userService;
        }

        [HttpPost("add")]
        public IActionResult AddFriend([FromBody] FriendRequestDto request)
        {
            string result = _friendService.SendFriendRequest(request.SenderId, request.ReceiverId);

            if (result == "Success")
            {
                return Ok(new { message = "Friend request sent!" });
            }

            return BadRequest(result);
        }

        [HttpGet("requests/{userId}")]
        public IActionResult GetRequests(Guid userId)
        {
            var requests = _friendService.GetPendingRequests(userId);
            return Ok(requests);
        }

        [HttpGet("list/{userId}")]
        public IActionResult GetFriends(Guid userId)
        {
            var friends = _friendService.GetFriendsList(userId);
            return Ok(friends);
        }

        [HttpPost("respond")]
        public IActionResult Respond([FromBody] RespondRequestDto request)
        {
            // Pass the DTO fields directly
            bool success = _friendService.RespondToRequest(request.InviterId, request.InviteeId, request.Accept);

            if (!success) return BadRequest("Request not found or already handled");

            return Ok(new { message = request.Accept ? "Friend Added" : "Request Rejected" });
        }

        [HttpGet("suggestions/{userId}")]
        public IActionResult GetSuggestions(Guid userId)
        {
            // 1. Get all users
            var allUsers = _userService.GetAllUsers();

            // 2. Get existing friends (to exclude them)
            var existingFriends = _friendService.GetFriendsList(userId)
                                                .Select(f => f.Id)
                                                .ToList();

            // 3. Get pending requests (Exclude people who already sent you a request)
            var pendingRequests = _friendService.GetPendingRequests(userId)
                                                .Select(r => r.Id)
                                                .ToList();

            // 4. Filter: Not Me, Not Friend, Not Pending Request
            var suggestions = allUsers
                .Where(u => u.Id != userId
                            && !existingFriends.Contains(u.Id)
                            && !pendingRequests.Contains(u.Id))
                .OrderBy(u => Guid.NewGuid()) // Randomize
                .Take(10)
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email
                });

            return Ok(suggestions);
        }
    }
}