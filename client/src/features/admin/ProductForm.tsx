//import { zodResolver } from "@hookform/resolvers/zod"
//import {  type CreateProductSchema } from "../../lib/Schemas/createProductSchema"
import { useForm, type FieldValues } from "react-hook-form"
import { Paper, Typography, Grid, Box, Button } from "@mui/material"
import AppTextInput from "../../app/shared/components/AppTextInput"

export default function ProductForm() {
  const { control, handleSubmit } = useForm({
    mode: 'onTouched', 
    // resolver: zodResolver(createProductSchema) //검증 엔진을 Zod로. React Hook Form 기본 validation은 너무 간단
  })
  const onSubmit = (data: FieldValues) => console.log(data)

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
        </Grid>

        <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
          <Button variant='contained' color='inherit'>Cancel</Button>
          <Button variant='contained' color='success' type="submit">Submit</Button>
        </Box>      
      </form>
    </Box>
  )
}