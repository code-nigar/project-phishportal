import PropTypes from 'prop-types';
import { useContext, useRef, useState } from 'react';
import { deepPurple } from '@mui/material/colors';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    CardContent,
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Popper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
import avatar1 from 'assets/images/users/avatar-1.png';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '../../../../../../node_modules/react-router/index';

import { Password, Username } from 'pages/authentication/auth-forms/AuthLogin';
import { capitalize } from 'lodash';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    const theme = useTheme();
    const [data, setData] = useState({});
    const [clientDetails, setClientDetails] = useState([]);

    let user = localStorage.getItem('userdata');
    user = JSON.parse(user);

    if (data.length > 0) {
        let name = data.data.data.filter((e) => e.email === data.data.authData.email);
        console.log(name);
    }

    const handleLogout = async () => {
        // logout
        localStorage.removeItem('siemToken');
        localStorage.removeItem('userdata');

        window.location.replace('/login');
    };

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const iconBackColorOpen = 'grey.300';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: '#f4f7fa',
                    color: 'black',
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    {/* <Avatar sx={{ bgcolor: deepPurple[500] }} style={{ textTransform: 'capitalize' }}>
                        {user?.username?.name?.[0]}
                    </Avatar>
                    <Typography variant="subtitle1" style={{ textTransform: 'capitalize' }}>
                        {user?.username?.name}
                    </Typography> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b6b79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user IconHover"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        {open && (
                            <Paper
                                sx={{
                                    boxShadow: theme.customShadows.z1,
                                    width: 290,
                                    minWidth: 240,
                                    maxWidth: 290,
                                    border: 'none',
                                    borderRadius: '0',
                                    [theme.breakpoints.down('md')]: {
                                        maxWidth: 250
                                    }
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard elevation={0} border={false} content={false} sx={{ borderRadius: '0', border: 'none', }}>
                                        <CardContent sx={{ p: 0, borderRadius: '0', border: 'none', }}>
                                                <div className = "dropdown-header d-flex align-items-center justify-content-between bg-primary py-2 px-3">
                                                    <div className = "d-flex my-2">
                                                        <div className = "flex-shrink-0">
                                                            <img src="assets/images/user/avatar-2.jpg" alt="user-profile" className="user-avtar wid-35"/>
                                                        </div>
                                                        <div className = "flex-grow-1 ms-3">
                                                            <h6 className = "text-white mb-1">{user?.username?.name}</h6>
                                                            <span className = "text-white text-opacity-75">{user?.type.toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/* <Grid container justifyContent="space-between" alignItems="center">
                                                {/* <Grid item>
                                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                                        <Avatar sx={{ bgcolor: deepPurple[500] }} style={{ textTransform: 'capitalize' }}>
                                                            {user?.username?.name?.[0]}
                                                        </Avatar>
                                                        <Stack>
                                                            <Typography variant="h6" style={{ textTransform: 'capitalize' }}>
                                                                {user?.username?.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" style={{ width: '20px' }}>
                                                                {user?.type.toUpperCase()}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid> 
                                                
                                                {/* <Grid item>
                                                    <IconButton size="large" color="secondary" onClick={handleLogout}>
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Grid> }
                                            </Grid> */}
                                        </CardContent>
                                        {open && (
                                            <>
                                                <TabPanel value={value} index={0} dir={theme.direction} sx={{ m:0 }}>
                                                    <ProfileTab handleLogout={handleLogout} />
                                                </TabPanel>
                                                {/* <TabPanel value={value} index={1} dir={theme.direction}>
                                                    <SettingTab />
                                                </TabPanel> */}
                                            </>
                                        )}
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        )}
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile;
