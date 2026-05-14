import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../../lib/Schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";

export default function LoginForm() {
    const [login, {isLoading}] = useLoginMutation();
    const [fetchUserInfo] = useLazyUserInfoQuery();    
    const location = useLocation();
    const { register, handleSubmit, formState:{errors} } = useForm<LoginSchema>({
        mode: 'onChange',
        resolver: zodResolver(loginSchema)
    });
    const navigation = useNavigate();
    

    const onSubmit = async (data: LoginSchema) => {
        await login(data); // 1. Send login request
        await fetchUserInfo(); // 2. Fetch current logged-in user info and update global state/cache
        navigation(location.state?.from || '/catalog'); // 3. Redirect to the originally requested page or fallback to /catalog if there's no value on 'from'
    }

    return (
        <Container component={Paper} maxWidth='sm' sx={{ borderRadius: 3 }}>
            <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
                <LockOutlined sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
                <Typography variant="h5">
                    Sign in
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    gap={3}
                    marginY={3}
                >
                    <TextField
                        fullWidth
                        label='Email'
                        autoFocus
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        fullWidth
                        label='Password'
                        type="password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button 
                        disabled={isLoading}
                        variant="contained" 
                        type="submit"
                    >
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?
                        <Typography sx={{ ml: 2 }} component={Link} to='/register' color='primary'>
                            Sign Up
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}