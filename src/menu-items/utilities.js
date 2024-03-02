// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import AttachMoneyOutlineIcon from '@mui/icons-material/AttachMoney';
// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Billing',
    type: 'group',
    children: [
        {
            id: 'billing',
            title: 'Invoice ',
            type: 'item',
            url: '/invoice',
            icon: AttachMoneyOutlineIcon
        }
        // {
        //     id: 'util-typography',
        //     title: 'Typography',
        //     type: 'item',
        //     url: '/typography',
        //     icon: icons.FontSizeOutlined
        // },
        // {
        //     id: 'util-color',
        //     title: 'Color',
        //     type: 'item',
        //     url: '/color',
        //     icon: icons.BgColorsOutlined
        // },
        // {
        //     id: 'util-shadow',
        //     title: 'Shadow',
        //     type: 'item',
        //     url: '/shadow',
        //     icon: icons.BarcodeOutlined
        // },
        // {
        //     id: 'ant-icons',
        //     title: 'Ant Icons',
        //     type: 'item',
        //     url: '/icons/ant',
        //     icon: icons.AntDesignOutlined,
        //     breadcrumbs: false
        // }
    ]
};

export default utilities;
