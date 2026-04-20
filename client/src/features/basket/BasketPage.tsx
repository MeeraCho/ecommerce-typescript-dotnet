import { Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";

export default function BasketPage() {
    const { data, isLoading } = useFetchBasketQuery();

    if (isLoading) return <Typography>Loading Basket...</Typography>
    if (!data || data.items.length === 0) return <Typography variant="h3">Your basket is empty</Typography>
    return (
        <div>{data.basketId}</div>
    )
}