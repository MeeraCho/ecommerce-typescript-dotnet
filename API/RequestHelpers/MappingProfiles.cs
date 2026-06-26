using API.DTOs;
using API.Entities;
using AutoMapper;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProductDto, Product>();
        
    }
}