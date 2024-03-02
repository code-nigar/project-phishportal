// assets
import { LoginOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhishingOutlineIcon from '@mui/icons-material/Phishing';
import ArticleOutlineIcon from '@mui/icons-material/Article';
import DescriptionOutlineIcon from '@mui/icons-material/Description';
import AccountBoxOulineIcon from '@mui/icons-material/AccountBox';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    LogoutOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const phishing = {
    id: 'phishing',
    title: 'Phishing Simulation',
    type: 'group',
    children: [
        // {
        //     id: 'Admin-page',
        //     title: 'Phishing',
        //     type: 'item',
        //     url: '/user-page',
        //     icon: PersonOutlineIcon,
        //     color: '#ffffff',
        //     children: []
        // },
        {
            id: 'user-page',
            title: 'Target Users',
            type: 'item',
            url: '/user-page',
            icon: PersonOutlineIcon,
            color: '#ffffff'
        },
        {
            id: 'templates-page',
            title: 'Templates',
            type: 'item',
            url: '/templates',
            icon: ArticleOutlineIcon,
            color: '#ffffff'
        },
        {
            id: 'landing-page',
            title: 'Landing Page',
            type: 'item',
            url: '/landing-page',
            icon: DescriptionOutlineIcon,
            color: '#ffffff'
        },
        {
            id: 'sending-profile',
            title: 'Sending Profile',
            type: 'item',
            url: '/sending-profile',
            icon: AccountBoxOulineIcon,
            color: '#ffffff'
        },
        {
            id: 'Compaign-page',
            title: 'Campaign',
            type: 'item',
            url: '/Campaign',
            icon: AddBusinessIcon,
            color: '#ffffff'
        }
    ]
};

export default phishing;
