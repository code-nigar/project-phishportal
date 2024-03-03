import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { FormHelperText, Grid, Link, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { Button } from 'react-bootstrap'
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Login } from 'api/api';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from '../../../../node_modules/react-router/index';
import { createContext } from 'react';
const Username = createContext();
const Password = createContext();
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    const [loader, setLoader] = React.useState(false);
    const [notify, setNotify] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});
    const [res, setRes] = React.useState({});
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();
    const handleLogin = async (values) => {
        setUsername(values.email);
        setPassword(values.password);
        setLoader(true);

        Login(values.email, values.password)
            .then((res) => {
                setLoader(false);
                localStorage.setItem('siemToken', '-----');
                localStorage.setItem('userdata', JSON.stringify(res.data));
                // console.log('Success');
                console.log(res.data);
                setRes(res);
                // navigate('/');
                window.location.replace('/');
            })
            .catch((err) => {
                setOpen(true);
                setNotify(true);
                setLoader(false);
                // console.log(err);
            });
    };
    console.log(res);
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {notify && (
                <Snackbar open={open} autoHideDuration={9000} onClose={handleClose} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
                style={{ width: '85%' }}
                >
                    <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose} style={{ color: 'white' }}>
                        Wrong Email or Password!
                    </Alert>
                </Snackbar>
            )}

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().max(255).required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                        setVal(values);
                        // console.log(values);
                        handleLogin(values);
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    {/* <InputLabel htmlFor="email-login">
                                        Username/Email
                                    </InputLabel> */}
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        fullWidth
                                        style={{ color: 'black', backgroundColor: 'transparent' }}
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    {/* <InputLabel htmlFor="password-login">
                                        Password
                                    </InputLabel> */}
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        style={{ color: 'black', backgroundColor: 'transparent' }}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} >
                                {/* <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                     <FormControlLabel /> 
                                    <Link variant="h6" component={RouterLink} to="" color="text.primary">
                                        Forgot Password?
                                    </Link>
                                </Stack> */}
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ marginBottom: '25px'}} >
                                    <Button
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Divider>
                                    <Typography variant="caption"> Login with</Typography>
                                </Divider>
                            </Grid>
                            <Grid item xs={12}>
                                <FirebaseSocial />
                            </Grid> */}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
export { Username, Password };
