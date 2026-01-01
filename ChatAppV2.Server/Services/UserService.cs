using System.Collections.Concurrent;
using ChatAppV2.Server.Models;

namespace ChatAppV2.Server.Services
{
    public class UserService
    {
        public ConcurrentDictionary<string, User> UsersByEmail { get; } = new();
        public ConcurrentDictionary<string, User> UsersByUsername { get; } = new();
        public ConcurrentDictionary<Guid, User> UsersById { get; } = new();

        public UserService()
        {
            SeedUsers();
        }

        private void SeedUsers()
        {
            var seededUsers = new List<User>
            {
                // 1. Pavan
                new User { Username = "Pavan",  Email = "pavan@gmail.com",  Password = "123" },
                
                // 2. Vedika
                new User { Username = "Vedika", Email = "vedika@gmail.com", Password = "123" },
                
                // 8 Other Indian Users
                new User { Username = "Rahul",  Email = "rahul@gmail.com",  Password = "123" },
                new User { Username = "Sneha",  Email = "sneha@gmail.com",  Password = "123" },
                new User { Username = "Amit",   Email = "amit@gmail.com",   Password = "123" },
                new User { Username = "Priya",  Email = "priya@gmail.com",  Password = "123" },
                new User { Username = "Vikram", Email = "vikram@gmail.com", Password = "123" },
                new User { Username = "Neha",   Email = "neha@gmail.com",   Password = "123" },
                new User { Username = "Rohit",  Email = "rohit@gmail.com",  Password = "123" },
                new User { Username = "Anjali", Email = "anjali@gmail.com", Password = "123" }
            };

            foreach (var user in seededUsers)
            {
                // Add to Dictionary (Key: Email)
                RegisterUser(user);
            }
        }

        public bool RegisterUser(User user)
        {
            if (UsersByEmail.ContainsKey(user.Email) || UsersByUsername.ContainsKey(user.Username))
            {
                return false;
            }

            bool emailAdded = UsersByEmail.TryAdd(user.Email, user);
            bool userAdded = UsersByUsername.TryAdd(user.Username, user);

            // Add to ID dictionary
            bool idAdded = UsersById.TryAdd(user.Id, user);

            return emailAdded && userAdded && idAdded;
        }

        public User? LoginUser(string email, string password)
        {
            if (UsersByEmail.TryGetValue(email, out User? user))
            {
                if (user.Password == password) return user;
            }
            return null;
        }

        public User? GetUserByEmail(string email)
        {
            // Case-insensitive search O(N) - suitable for simple lists
            UsersByEmail.TryGetValue(email, out User? user);
            return user;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return UsersByEmail.Values;
        }
    }
}