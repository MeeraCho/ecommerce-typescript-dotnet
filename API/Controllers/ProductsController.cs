using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = context.Products
                        .Sort(productParams.OrderBy)
                        .Search(productParams.SearchTerm)
                        .Filter(productParams.Brands, productParams.Types)
                        .AsQueryable();
            
            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.Metadata);
            
            return products;
        }

        [HttpGet("{id}")] //api/products/2
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters() 
        {
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            
            var product = mapper.Map<Product>(productDto);
            
            context.Products.Add(product);
            var result = await context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction(nameof(GetProduct), new {id = product.Id}, product);
            return BadRequest("Problem creating new product");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await context.Products.FindAsync(updateProductDto.Id);

            if (product == null) return NotFound();

            mapper.Map(updateProductDto, product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return NoContent();

            return BadRequest("Problem updating product");
        }
    }
}