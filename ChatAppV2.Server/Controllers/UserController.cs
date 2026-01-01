using ChatAppV2.Server.Dtos;
using ChatAppV2.Server.Models;
using ChatAppV2.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // The Id is auto-generated in the User constructor, 
            // so we don't need to check it here.

            bool isSuccess = _userService.RegisterUser(user);

            if (!isSuccess)
            {
                return BadRequest("User with this Email or Username already exists.");
            }

            return Ok(new { message = "User registered successfully", userId = user.Id });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _userService.LoginUser(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid Email or Password");
            }

            // Map to DTO to hide password
            var userDto = new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            };

            return Ok(userDto);
        }

        // Add this method inside your UserController class

        [HttpGet("search/{email}")]
        public IActionResult Search(string email)
        {
            var user = _userService.GetUserByEmail(email);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Return safe DTO (no password)
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email
            });
        }
    }
}
