//import { zodResolver } from "@hookform/resolvers/zod"
import {  type CreateProductSchema } from "../../lib/Schemas/createProductSchema"
import { Controller, useForm } from "react-hook-form"
import { Paper, Typography, Grid, TextField, Box, Button } from "@mui/material"

export default function ProductForm() {
  const { control, handleSubmit } = useForm<CreateProductSchema>({
    mode: 'onTouched', //언제 에러를 검사할 거냐? input을 한 번이라도 클릭(blur)하면 그 이후부터 validation 실행
    // resolver: zodResolver(createProductSchema) //검증 엔진을 Zod로. React Hook Form 기본 validation은 너무 간단
  })
  const onSubmit = (data: CreateProductSchema) => console.log(data)


  return (
    <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
    
      <Typography variant="h4" sx={{mb: 4}}>
          Product details
      </Typography> 

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
              <Controller
                render={({ field }) => <TextField {...field} fullWidth label="name"/>}
                name="name"
                control={control}
                defaultValue=""
              />
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