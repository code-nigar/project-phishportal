import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
// import AuthChangePassword from 'pages/authentication/ChangePassword';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthChangePassword = Loadable(lazy(() => import('pages/authentication/ChangePassword')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //
let data = JSON.parse(localStorage.getItem('userdata'));

const LoginRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: 'login',
            element: <AuthLogin />
        },

        {
            path: data ? 'changePassword' : 'login',
            element: data ? <AuthChangePassword /> : <AuthLogin />
        }
    ]
};

export default LoginRoutes;
