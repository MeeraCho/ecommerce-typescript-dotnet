using System.Security.Cryptography.Pkcs;
using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
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

    [HttpGet]
    public async Task<ActionResult<OrderDto>> GetOrderDetail(int id)
    {
        var order = await context.Orders
                    .ProjectToDto()
                    .Where(x => x.BuyerEmail == User.GetUsername() && x.Id == id)
                    .FirstOrDefaultAsync();
        if (order == null) return NotFound();
        return order;
    }

    }
