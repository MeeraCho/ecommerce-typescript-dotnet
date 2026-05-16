using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

// 1.Create the app builder
var builder = WebApplication.CreateBuilder(args);

// 2.Register services(Dependency Injection) add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt => 
{
	opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;

})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// 3.Build the app
var app = builder.Build();

// 4.Middleware pipeline - configure the HTTP request pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(opt => 
{
    opt.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("https://localhost:3000", "https://localhost:3001");
});

app.UseAuthentication();
app.UseAuthorization();

// 5.Map endpoints
app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); // api/login

// 6.Initialize database
DbInitializer.InitDb(app);

// 7.Run the app
app.Run();
