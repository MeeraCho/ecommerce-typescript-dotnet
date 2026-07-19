import { Box, Paper, Typography, Grid, Button } from "@mui/material"
import { useForm } from "react-hook-form"
import { createProductSchema, type CreateProductSchema } from "../../lib/Schemas/createProductSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import AppTextInput from "../../app/shared/components/AppTextInput"
import { useFetchFiltersQuery } from "../catalog/catalogApi"
import AppSelectInput from "../../app/shared/components/AppSelectInput"
import AppDropzone from "../../app/shared/components/AppDropzone"

export default function ProductForm() {
  const { control, handleSubmit, watch } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema)
  })

  const watchFile = watch('file');
  const { data } = useFetchFiltersQuery();

  const onSubmit = (data: CreateProductSchema) => console.log(data)  
  
  return (
    <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
    
      <Typography variant="h4" sx={{mb: 4}}>
          Product details
      </Typography>   
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid>
          <Grid size={6}>
            {data?.brands && 
              <AppSelectInput items={data.brands} control={control} name="brand" label="Brand" />
            }
          </Grid>
          <Grid size={6}>
            {data?.types && 
              <AppSelectInput items={data.types} control={control} name="type" label="Type"  />
            }
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="price" label="Price" type="number" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="quantityInStock" label="Quantity in Stock" type="number"/>
          </Grid>
          <Grid size={12}>
            <AppTextInput control={control} name="description" label="Description" multiline rows={4}/>
          </Grid>
          <Grid size={12} display='flex' justifyContent='space-between' alignItems='center'>
            <AppDropzone name="file" control={control} />
            {
              watchFile && (
                <img 
                  src = {watchFile.preview}
                  alt = 'preview of image'
                  style = {{ maxHeight: 200}}
                />
              )
            }
          </Grid>                                                                                                                     
        </Grid>

        <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
          <Button variant='contained' color='inherit'>Cancel</Button>
          <Button variant='contained' color='success' type='submit'>Submit</Button>
        </Box>
      </form>      
    </Box>
  )
}