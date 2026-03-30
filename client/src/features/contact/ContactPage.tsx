import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { CounterState } from "./counterReducer";

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
        <Button onClick={() => dispatch({type: 'decrement'})} color="error">Decrement</Button>
        <Button onClick={() => dispatch({type: 'increment'})} color="secondary">Increment</Button>
      </ButtonGroup>
    </>
  )
}