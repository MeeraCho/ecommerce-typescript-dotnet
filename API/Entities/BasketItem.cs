using System;

namespace API.Entities;

public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    // navigation properties 
    public int ProductId { get; set; } // FK Product table
    public required Product Product { get; set; }

    public int BasketId { get; set; } //FK Basket table 
    public Basket Basket { get; set; } = null!;

}
