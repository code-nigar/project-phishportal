import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Button,
    FormHelperText, //Box, TextField,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { message } from 'antd';
// third party
import * as Yup from 'yup';
import {
    Formik //Form, Field, ErrorMessage
} from 'formik';
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets

import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {
    //api,
    changePassword //Wazuh
} from '../../../api/api';
import MuiAlert from '@mui/material/Alert';
//import useUserDetailStore from 'zu-store/zuStore';
// import { decodeToken } from 'utils/tokenUtil';
//import { values } from 'lodash';
// import { TextField } from '../../../../node_modules/@material-ui/core/index';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ============================|| FIREBASE - LOGIN ||============================ //
message.config({
    top: 70,
    duration: 3
});
const AuthChangePassword = () => {
    //const {detail, clear} = useUserDetailStore();
    const [loader, setLoader] = React.useState(false);
    const [notify, setNotify] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});
    const navigate = useNavigate();
    // const handleChangePassword = async (values) => {
    //     console.log(values);
    //     setLoader(true);

    //     changePassword(values)
    //         .then((res) =>{ message.success('Password Changed Successfully');
    //             localStorage.setItem('clientToken', '');
    //             setTimeout(()=>{ navigate("/login")},2000);
    //             console.log(res?.data?.data)
    //            })
    //         .catch((err) => {message.error('Password Could Not Be Updated')});
    //     setLoader(false);
    // };

    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState('');
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const handleChangePassword = async (values) => {
        // console.log(values);
        setLoader(true);
        const obj = { ...values, email: email };
        // console.log(obj)

        const password = obj.newPassword;

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[#^()/!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
        // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        const isValidPassword = passwordRegex.test(password);
        // console.log(isValidPassword)
        if (isValidPassword && obj.newPassword == obj.confirmPassword) {
            // console.log("Password is valid.");

            changePassword(obj)
                .then((res) => {
                    message.success('Password Changed Successfully');
                    localStorage.removeItem('clientToken');
                    //clear();
                    // setTimeout(()=>{ navigate("/login")},2000);
                    window.location.replace('/login');
                    // console.log(res?.data?.data)
                })

                .catch((err) => {
                    message.error('Password Could Not Be Updated');
                });
            setLoader(false);
        } else {
            message.error('Invalid Password');
            setLoader(false);
        }
        setLoader(false);
    };

    // };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
    const handleEChange = (e) => {
        setEmail(e.target.value);
    };
    useEffect(() => {
        // Wazuh()
        // console.log(values)
        //let data = JSON.parse(localStorage.getItem('clientToken'))
        //let data = detail[0]
        let ctkn = JSON.parse(localStorage.getItem('userdata'));
        //console.log(ctkn);
        // let dtkn = decodeToken(ctkn?.token);
        //console.log(dtkn);
        //setUserDetail(dtkn);
        setEmail(ctkn?.email);
        console.log(ctkn.email);
        // console.log(data?.email)
        //  handleChangePassword()
    }, []);
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least one uppercase letter, one lowercase letter and one special character'
            )
    });

    return (
        <>
            {notify && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose} style={{ color: 'white' }}>
                        Invalid Credentials
                    </Alert>
                </Snackbar>
            )}

            <Formik
                initialValues={{
                    email: email,
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                    checkPassword: '',
                    submit: null
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    newPassword: Yup.string()
                        .max(255)
                        .required('New Password is required')
                        .min(8, 'Password must be at least 8 characters')
                        .matches(
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[#^()/!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
                            // /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
                            // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            'Password must contain at least one uppercase letter, one lowercase letter and one special character'
                        ),
                    confirmPassword: Yup.string()
                        .max(255)
                        //  .oneOf([Yup.ref('newPassword'), null]
                        //  , 'Passwords must match')
                        .required('Confirm Password is required'),
                    checkPassword: Yup.string().max(255).required('Passwords do not match')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                        setVal(values);
                        handleChangePassword(values);
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
                                    <InputLabel htmlFor="email-login" sx={{ color: '#888' }}>
                                        Email Address / Username
                                    </InputLabel>
                                    <OutlinedInput
                                        sx={{ color: '#888' }}
                                        id="email-login"
                                        type="email"
                                        onChange={handleEChange}
                                        value={email}
                                        name="email"
                                        placeholder="Enter email "
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login" sx={{ color: '#888' }}>
                                        Old Password
                                    </InputLabel>
                                    <OutlinedInput
                                        sx={{ color: '#888' }}
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
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
                                                    {showPassword ? (
                                                        <EyeOutlined style={{ color: 'white' }} />
                                                    ) : (
                                                        <EyeInvisibleOutlined style={{ color: 'white' }} />
                                                    )}
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
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="newpassword-login" sx={{ color: '#888' }}>
                                        New Password
                                    </InputLabel>
                                    <OutlinedInput
                                        sx={{ color: '#888' }}
                                        fullWidth
                                        error={Boolean(touched.newPassword && errors.newPassword)}
                                        id="-newpassword-login"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={values.newPassword}
                                        name="newPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOutlined style={{ color: 'white' }} />
                                                    ) : (
                                                        <EyeInvisibleOutlined style={{ color: 'white' }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter New Password"
                                    />
                                    {touched.newPassword && errors.newPassword && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.newPassword}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="confirmpassword-login" sx={{ color: '#888' }}>
                                        Confirm Password
                                    </InputLabel>
                                    <OutlinedInput
                                        sx={{ color: '#888' }}
                                        fullWidth
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                        id="-confirmpassword-login"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOutlined style={{ color: ' white' }} />
                                                    ) : (
                                                        <EyeInvisibleOutlined style={{ color: ' white' }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter Confirm password"
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.confirmPassword}
                                        </FormHelperText>
                                    )}
                                    {values.newPassword !== values.confirmPassword && values.confirmPassword.length > 0 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.checkPassword}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ marginTop: '25px' }} >
                                {/* <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting || loader}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: 'rgb(88, 173, 198)' }}
                                        onClick={() => handleChangePassword(values)}
                                    >
                                        Update Password
                                    </Button>
                                    {loader && <LinearProgress />}
                                </AnimateButton> */}
                                <button
                                    type="submit"
                                    className="btn btn-primary shadow px-sm-4"
                                    onClick={() => handleChangePassword(values)}
                                >
                                Update Password
                                </button>
                                {loader && <LinearProgress />}
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>

            {/* <Formik
      initialValues={{
        email: email,
        password: '',
        newPassword: '',
        confirmPassword: '',
        submit: null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setStatus({ success: false });
          setSubmitting(false);
          handleChangePassword(values);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >{({ errors, handleSubmit, handleBlur,handleChange,isSubmitting, touched, values }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            // onBlur={handleBlur}
            // onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.newPassword && errors.newPassword)}
            fullWidth
            helperText={touched.newPassword && errors.newPassword}
            label="New Password"
            margin="normal"
            name="newPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.newPassword}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            label="Confirm Password"
            margin="normal"
            name="confirmPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.confirmPassword}
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => handleChangePassword(values)}
            >
              Change Password
            </Button>
          </Box>
        </form>
      )}
    </Formik> */}
        </>
    );
};

export default AuthChangePassword;

// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const ChangePasswordForm = () => {
//   return (
//     <Formik
//       initialValues={{
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//       }}
//       validationSchema={Yup.object({
//         currentPassword: Yup.string()
//           .required('Required'),
//         newPassword: Yup.string()
//           .required('Required')
//           .min(8, 'Password must be at least 8 characters')
//           .matches(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//             'Password must contain at least one uppercase letter, one lowercase letter, and one special character'
//           ),
//         confirmPassword: Yup.string()
//           .required('Required')
//           .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
//       })}
//       onSubmit={(values, { setSubmitting }) => {
//         setTimeout(() => {
//           alert(JSON.stringify(values, null, 2));
//           setSubmitting(false);
//         }, 400);
//       }}
//     >
//       {({ isSubmitting }) => (
//         <Form>
//           <div>
//             <label htmlFor="currentPassword">Current Password:</label>
//             <Field type="password" id="currentPassword" name="currentPassword" />
//             <ErrorMessage name="currentPassword" />
//           </div>

//           <div>
//             <label htmlFor="newPassword">New Password:</label>
//             <Field type="password" id="newPassword" name="newPassword" />
//             <ErrorMessage name="newPassword" />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword">Confirm New Password:</label>
//             <Field type="password" id="confirmPassword" name="confirmPassword" />
//             <ErrorMessage name="confirmPassword" />
//           </div>

//           <button type="submit" disabled={isSubmitting}>
//             Submit
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default ChangePasswordForm;
