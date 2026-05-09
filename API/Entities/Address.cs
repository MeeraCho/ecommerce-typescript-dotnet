using System.Text.Json.Serialization;

namespace API.Entities;

public class Address
{
    [JsonIgnore] // NOT be accepted from JSON input
    public int Id { get; set; }

    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    

    [JsonPropertyName("postal_code")] //This changes the name of the property when converting between C# and JSON.
    public required string PostalCode { get; set; }

    public required string Country { get; set; }
}
