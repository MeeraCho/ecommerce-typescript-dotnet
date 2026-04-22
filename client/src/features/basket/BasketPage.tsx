import { Grid, Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";
import BasketItem from "./BasketItem";

export default function BasketPage() {
    const { data, isLoading } = useFetchBasketQuery();

    if (isLoading) return <Typography>Loading Basket...</Typography>
    if (!data || data.items.length === 0) return <Typography variant="h3">Your basket is empty</Typography>
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                {data.items.map(item => (
                    <BasketItem key={item.productId} item={item} />
                ))}
            </Grid>
        </Grid>
    )
}