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
public class OrdersController(StoreContext context) : BaseApiController
{
    [HttpGet] //GET api/orders
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
                    .ProjectToDto()
                    .Where(x => x.BuyerEmail == User.GetUsername())
                    .ToListAsync();
        return orders;
    }

    [HttpGet] //GET api/orders/1
    public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
    {
        var order = await context.Orders
                    .ProjectToDto()
                    .Where(x => x.BuyerEmail == User.GetUsername() && x.Id == id)
                    .FirstOrDefaultAsync();
        if (order == null) return NotFound();
        return order;
    }

    [HttpPost] // Post api/orders
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        // get uers's basket 
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        
        // validate uers's basket
        if(basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
            return BadRequest("Basket is empty or not found");

        // convert basket items to order items
        var items = CreateOrderItems(basket.Items);

        // validate uers's basket items 
        if (items == null) return BadRequest("Some items out of stock");

        // calculate totals
        var subtotal = items.Sum(x => x.Price * x.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);

        // search for an existing order using the Stripe PaymentIntentId - preventing idempotency (duplicate orders from being created)
        var order = await context.Orders    
                        .Include(x => x.OrderItems)
                        .FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);
        
        // if order does NOT exist → create new order
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

            context.Orders.Add(order); // Adds the order to EF Core tracking
        }
        else
        {
            context.Orders.Add(order);
        }

        // save changes to database
        var result = await context.SaveChangesAsync() > 0;

        // if SaveChangesAsync() returns 0, no changes were saved to the db
        if (!result) return BadRequest("Something went wrong while creating the order");

        return CreatedAtAction(
            nameof(GetOrderDetails), //specifies the action that can retrieve the resource
            new { id = order.Id }, // supplies route values
            order.ToDto());        // return newly created order
    }

    private long CalculateDeliveryFee(long subtotal)
    {
        return subtotal > 10000 ? 0 : 500;
    }

    private List<OrderItem>? CreateOrderItems(List<BasketItem> items)
    {
        // Create a new empty list to store the converted order items
        var orderItems = new List<OrderItem>();

		// Loop through each item in the user's basket
        foreach (var item in items)
        {
            // Check whether there is enough stock available
            if(item.Product.QuantityInStock < item.Quantity)
                return null;
            
            // Create a new OrderItem from the BasketItem
            var orderItem = new OrderItem
            {
                // Store a snapshot of product information at the time of purchase
                ItemOrdered = new ProductItemOrdered
                {
                    ProductId = item.ProductId,
                    PictureUrl = item.Product.PictureUrl,
                    Name = item.Product.Name
                },
                Price = item.Product.Price, // Save the product price at the time the order is created
                Quantity = item.Quantity    // Save how many units the customer purchased
            };
            
            // Add the newly created order item to the list
            orderItems.Add(orderItem);

            // Reduce the available product stock quantity
            item.Product.QuantityInStock -= item.Quantity;
        }  

        return orderItems;
    }
}
