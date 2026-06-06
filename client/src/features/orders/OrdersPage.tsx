import { Container, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { currencyFormat } from "../../lib/utils";
import { useFetchOrdersQuery } from "./orderApi";

export default function OrdersPage() {
    const {data: orders, isLoading} = useFetchOrdersQuery();
    const navigate = useNavigate();

    if(!orders) return <Typography variant="h5">No Orders Available</Typography>
    if(isLoading) return <Typography variant="h5">Loading Orders...</Typography>

    return (
        <Container maxWidth='md'>
            <Typography variant='h5' align="center" gutterBottom>
                My Orders
            </Typography>
            <Paper sx={{borderRadius: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Order</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Staus</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} onClick={() => navigate(`/orders/${order.id}`)} hover style={{cursor: 'pointer'}}>
                                <TableCell align="center"># {order.id}</TableCell>
                                <TableCell>{format(order.orderDate, 'dd MMM yyyy')}</TableCell>
                                <TableCell>{currencyFormat(order.total)}</TableCell>
                                <TableCell>{order.orderStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    )

}