import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import Logo from 'components/Logo';

// ================================|| LOGIN ||================================ //

const Login = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="column" justifyContent="center" alignItems="center">
                    <Logo/>
                    <Typography variant="h4" className="mb-2 mt-4" sx={{color: '--var(--pc-heading-color)'}}>
                        Welcome Back
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
                <div className='d-flex justify-content-center align-items-center'>
                    <Typography component={Link} to="/signup" variant="p" color="primary">
                        Don&apos;t have an account? Sign Up Now
                    </Typography>
                </div>
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default Login;
