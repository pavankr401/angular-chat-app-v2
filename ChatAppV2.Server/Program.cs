using ChatAppV2.Server.Hubs; // <--- Import Hubs Namespace
using ChatAppV2.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("https://localhost:54137") // Check your Angular port!
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // Required for SignalR
});

// Add services to the container.
builder.Services.AddControllers();

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- REGISTER SERVICES ---
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<FriendService>();
builder.Services.AddSingleton<ChatService>(); // <--- Register ChatService

// --- REGISTER SIGNALR ---
builder.Services.AddSignalR(); // <--- Add SignalR Core Services

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS *before* Authorization and Hub Mapping
app.UseStaticFiles();
app.UseCors("AllowAngular");
app.UseAuthorization();

// --- MAP ENDPOINTS ---
app.MapControllers();
app.MapHub<ChatHub>("/chatHub"); // <--- Map the SignalR Hub Route

app.MapFallbackToFile("/index.html");

app.Run();