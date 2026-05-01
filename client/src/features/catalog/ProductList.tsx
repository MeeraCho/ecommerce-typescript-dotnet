import { Grid } from "@mui/material"
import ProductCard from "./ProductCard"
import type { Product } from "../../app/models/product"

type Props = {
    products: Product[]
}

export default function ProductList({products}: Props) {
    return (
        <Grid container spacing={3}>
            {products.map(product => (
                <Grid size={3} display='flex' key={product.id}>
                    <ProductCard key={product.id} product={product} />
                </Grid>
            ))}
        </Grid>
    )
}