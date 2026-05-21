import { Grid, Typography } from "@mui/material"
import OrderSummary from "../../app/shared/components/OrderSummary"
import CheckoutStepper from "./CheckoutStepper"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useFetchBasketQuery } from "../basket/basketApi";
import { useMemo } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
export default function CheckoutPage() {
	const { data: basket } = useFetchBasketQuery();
	
	const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket?.clientSecret
    }
  }, [basket?.clientSecret])
	
  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {!stripePromise || !options ? (
          <Typography variant="h6">Loading checkout...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid>
      <Grid size={4}>
        <OrderSummary />
      </Grid>
    </Grid>
  )
}
