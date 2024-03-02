// import { DashboardOutlined } from '@ant-design/icons';
import GridViewIcon from '@mui/icons-material/GridView';

// const icons = {
//     DashboardOutlined
// };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/user-page',
            icon: GridViewIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
