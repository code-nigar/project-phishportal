// assets
import { LoginOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import AttachMoneyOutlineIcon from '@mui/icons-material/AttachMoney';
import PersonAddAltOutlineIcon from '@mui/icons-material/PersonAddAlt';
//import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    LogoutOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'authentication',
    title: 'Portal Management',
    type: 'group',
    children: [
        {
            id: 'login1',
            title: 'User ',
            type: 'item',
            url: '/user-mgt',
            icon: PersonAddAltOutlineIcon
        }
    ]
};

export default pages;
