import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, type CounterState } from "./counterReducer";

export default function ContactPage() {
  const data = useSelector((state: CounterState) => state.data)
  const dispatch = useDispatch();
  return (
    <>
      <Typography variant="h2">
        Contact Page
      </Typography>
      <Typography variant="body1">
        The data is: {data}
      </Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch(decrement(1))} color="error">Decrement</Button>
        <Button onClick={() => dispatch(increment(1))} color="secondary">Increment</Button>
        <Button onClick={() => dispatch(increment(5))} color="primary">Increment by 5</Button>
      </ButtonGroup>
    </>
  )
}