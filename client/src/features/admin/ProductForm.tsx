import { zodResolver } from "@hookform/resolvers/zod"
import { createProductSchema, type CreateProductSchema } from "../../lib/Schemas/createProductSchema"
import { useForm } from "react-hook-form"

export default function ProductForm() {
  const { register } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema)
  })

  return (
    <div>ProductForm</div>
  )
}