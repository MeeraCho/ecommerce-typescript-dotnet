using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto : CreateProductDto
{
    public int Id { get; set; }
}