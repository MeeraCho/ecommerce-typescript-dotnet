import { Box, Divider, Typography, TableContainer, Table, TableBody, TableRow, TableCell} from "@mui/material";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/utils";

export default function Review() {
  const {basket} = useBasket();
  
  return (
    <div>
        <Box mt={4} width='100%'>
          <Typography variant="h6" fontWeight='bold'>
              Billing and delivery information
          </Typography>
          <dl>
              <Typography component='dt' fontWeight='medium'>
                  Shipping address
              </Typography>
              <Typography component='dd' mt={1} color='textSecondary'>
                  address goes here
              </Typography>

              <Typography component='dt' fontWeight='medium'>
                  Payment details
              </Typography>
              <Typography component='dd' mt={1} color='textSecondary'>
                  payment detail goes here
              </Typography>
          </dl>
        </Box>
        <Box mt={6} mx='auto'>
          <Divider />
          <TableContainer>
            <Table>
              <TableBody>
                {basket?.items.map((item) => (
                  <TableRow key={item.productId} sx={{borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
                    <TableCell sx={{py: 4}}>
                      <Box display='flex' gap={3} alignItems='center'>
                          <img src={item.pictureUrl} 
                              alt={item.name} 
                              style={{width: 40, height: 40}} 
                          />
                          <Typography>
                              {item.name}
                          </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{p: 4}}>
                        x {item.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{p: 4}}>
                        {currencyFormat(item.price)}
                    </TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
    </div>
  )
}