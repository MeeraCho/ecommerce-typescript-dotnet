using API.Controllers;
using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
public class OrderController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
                    .ProjectToDto()
                    .Where(x => x.BuyerEmail == User.GetUsername())
                    .ToListAsync();
        return orders;
    }
}
