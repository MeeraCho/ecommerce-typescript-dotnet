import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function LoginForm(){
    return (
        <Container component={Paper} maxWidth='sm' sx={{borderRadius: 3}}>
            <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
                <LockOutlined sx={{ mt: 3, color: 'secondary.main', fontSize:40}} />
                <Typography variant='h5'>
                    Sign In
                </Typography>
                <Box component='form' width='100%' display='flex' flexDirection='column' gap={3} marginY={3}>
                    <TextField fullWidth label="Email" autoFocus/>
                    <TextField fullWidth label="Password" type="password"/>
                    <Button variant='contained' type='submit' >Sign In</Button>
                    <Typography sx={{ textAlign: 'center'}}>
                        Don't have an account?
                        <Typography sx={{ml: 2}} component={Link} to='/register' color='primary'>
                            Sign Up
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}