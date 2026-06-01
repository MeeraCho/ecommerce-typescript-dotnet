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

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        // 1. get uers's basket
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

        // validate uers's basket 
        if ( basket == null ||                                // Basket doesn't exists
                basket.Items.Count == 0 ||                    //Basket doesn't contains items
                string.IsNullOrEmpty(basket.PaymentIntentId)) //Stripe PaymentIntent doesn't exists
            return BadRequest("Basket is empty or not found"); 
                
        // 2. convert basket items to order items 
        var items = CreateOrderItems(basket.Items);

        // validate uers's basket item     
        if (items == null) return BadRequest("Some items out of stock");

        // 3. calculate totals
        var subtotal = items.Sum(x => x.Price * x.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);
            
            // 4. check for existing order (idempotency)
        var order = await context.Orders
            .Include(x => x.OrderItems) //retrieves all associated OrderItems
            .FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);
    
            // 5. If order does NOT exist, create new order OR update order if exists
        if (order == null)
        {
            order = new Order
            {
                BuyerEmail = User.GetUsername(),           //the email address of the logged-in user.
                ShippingAddress = orderDto.ShippingAddress,//the delivery address provided by the customer.
                OrderItems = items,                        //the products being purchased.
                Subtotal = subtotal,
                DeliveryFee = deliveryFee,            
                PaymentIntentId = basket.PaymentIntentId,   //the Stripe PaymentIntent identifier used to link the order to the payment.
                PaymentSummary = orderDto.PaymentSummary,  //payment details from the checkout form.        
            };
                    
                    // Adds the order to EF Core tracking.
            context.Orders.Add(order);
            
            // cleans up
            context.Baskets.Remove(basket); //The customer's basket is removed from the database because it is no longer needed after the order has been created.
            Response.Cookies.Delete("basketId"); //The basket cookie is deleted from the user's browser since the basket no longer exists.
        }
        else 
        {
            // If order already exists → update items
            order.OrderItems = items;
        }   
    
            // 6. Save changes to database
        var result = await context.SaveChangesAsync() > 0;
            
            // 7. Handle failure - if SaveChangesAsync() returns 0, no changes were saved to the database.
        if (!result) return BadRequest("Something went wrong while creating the order.r");
            
            // 8. Return success response	
        return CreatedAtAction(
                    nameof(GetOrderDetails), //specifies the action that can retrieve the resource
                    new { id = order.Id },   //supplies route values
                    order.ToDto());          //return newly created order data
    }

        private long CalculateDeliveryFee(long subtotal)
    {
        return subtotal > 10000 ? 0 : 500;
    }


    private List<OrderItem>? CreateOrderItems(List<BasketItem> items)
    {
        var orderItems = new List<OrderItem>();

        foreach (var item in items)
        {
            if (item.Product.QuantityInStock < item.Quantity)
                return null;

            var orderItem = new OrderItem
            {
                ItemOrdered = new ProductItemOrdered
                {
                    ProductId = item.ProductId,
                    PictureUrl = item.Product.PictureUrl,
                    Name = item.Product.Name
                },
                Price = item.Product.Price,
                Quantity = item.Quantity
            };
            orderItems.Add(orderItem);

            item.Product.QuantityInStock -= item.Quantity;
        }

        return orderItems;
    }
}
