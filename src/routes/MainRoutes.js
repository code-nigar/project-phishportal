import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Compaign from 'pages/extra-pages/Comapigns';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const GoPhish = Loadable(lazy(() => import('pages/extra-pages/GoPhish')));
const UsersAndGroups = Loadable(lazy(() => import('pages/extra-pages/UsersAndGroups')));
const LandingPage = Loadable(lazy(() => import('pages/extra-pages/LandingPage')));
const Templates = Loadable(lazy(() => import('pages/extra-pages/Templates')));
const CompaignResult = Loadable(lazy(() => import('pages/extra-pages/CompaignsResult')));
const SendingProfile = Loadable(lazy(() => import('pages/extra-pages/SendingProfile')));
const ReportPage = Loadable(lazy(() => import('pages/extra-pages/report')));
const UserMgt = Loadable(lazy(() => import('pages/management/user')));
const BillingMgt = Loadable(lazy(() => import('pages/management/billing')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthSignup = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| MAIN ROUTING ||============================== //
const token = localStorage.getItem('siemToken');
const MainRoutes = {
    path: '/',
    element: token ? <MainLayout /> : <AuthSignup />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/Signup',
            element: <AuthSignup />
        },
        {
            path: 'color',
            element: <Color />
        },
        // {
        //     path: 'dashboard',
        //     children: [
        //         {
        //             path: 'default',
        //             element: <DashboardDefault />
        //         }
        //     ]
        // },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'Phishing',
            element: JSON.parse(localStorage.getItem('userdata'))?.type === 'SuperUser' ? <GoPhish /> : <Compaign />
        },
        {
            path: '/user-page',
            element: <UsersAndGroups />
        },
        {
            path: '/templates',
            element: <Templates />
        },
        {
            path: '/user-mgt',
            element: JSON.parse(localStorage.getItem('userdata'))?.type === 'SuperUser' ? <UserMgt /> : <DashboardDefault />
        },
        {
            path: '/invoice',
            element: <BillingMgt />
        },
        {
            path: '/landing-page',
            element: <LandingPage />
        },
        {
            path: '/sending-profile',
            element: <SendingProfile />
        },
        {
            path: '/Campaign',
            element: <Compaign />
        },
        {
            path: '/Campaign/:id',
            element: <CompaignResult />
        },
        // {
        //     path: 'siem',
        //     element: <ReportPage />
        // },
        {
            path: 'shadow',
            element: <Shadow />
        },
        {
            path: 'typography',
            element: <Typography />
        },
        {
            path: 'icons/ant',
            element: <AntIcons />
        }
    ]
};

export default MainRoutes;
