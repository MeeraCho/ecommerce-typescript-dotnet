import { Grid } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppSelector } from "../../app/store/store";

export default function Catalog() {
const productParams = useAppSelector(state => state.catalog);
const {data, isLoading} = useFetchProductsQuery(productParams);

if (isLoading || !data) return <div>Loading...</div>

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters />
      </Grid>
      <Grid size={9}>
        <ProductList products={data} />
      </Grid>
    </Grid>
  )
}
