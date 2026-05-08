using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User{UserName=registerDto.Email, Email=registerDto.Email};
            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await signInManager.UserManager.AddToRoleAsync(user, "Member");

            return Ok();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var roles = await signInManager.UserManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Email,
                user.UserName,
                Roles = roles
            });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }

        [Authorize] // Only authenticated users can access this endpoint
        [HttpPost("address")] //api/account/address
        public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
        {
            // Get current logged-in user from database including their address
            var user = await signInManager.UserManager.Users
                .Include(x => x.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);
                    
            // Return 401 Unauthorized if user is not found
            if (user == null) return Unauthorized();
            
            // Assign the incoming address to the current user
            user.Address = address;
            
            // Save the updated user including address to the database
            var result = await signInManager.UserManager.UpdateAsync(user);
                    
            // Return 400 BadRequest if updating the user fails
            if (!result.Succeeded) return BadRequest("Problem updating user address");
                    
            // Return the updated address with HTTP 200 OK
            return Ok(user.Address);
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<Address>> GetSavedAddress()
        {
            var address = await signInManager.UserManager.Users
                                .Where(x => x.UserName == User.Identity!.Name)
                                .Select(x => x.Address)
                                .FirstOrDefaultAsync();
            if (address == null) return NoContent();
            return address;
        }

    }
}
