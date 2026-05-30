using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

public static class OrderExtensions
{
    public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query)
    {
        return query.Select(order => new OrderDto
        {
		    // Mapping Simple Properties
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            ShippingAddress = order.ShippingAddress,
            PaymentSummary = order.PaymentSummary,
            DeliveryFee = order.DeliveryFee,
            Subtotal = order.Subtotal,
            
            // Converting Enum to String
            OrderStatus = order.OrderStatus.ToString(),
            
            // Calls a method on the Order entity.
            Total = order.GetTotal(),
            
            // Mapping Order Items. An order contains multiple items
            // This code converts each OrderItem into an OrderItemDto.
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrdered.ProductId,
                Name = item.ItemOrdered.Name,
                PictureUrl = item.ItemOrdered.PictureUrl,
                Price = item.Price,
                Quantity = item.Quantity
            }).ToList()
        }).AsNoTracking(); //only reading data. Don't track these objects for updates.
    }
}