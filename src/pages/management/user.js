// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { Typography, Button, Box, TextField, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { Modal, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import { createPortalUser, getPortalUsers, deletePortalUser } from 'api/api';
import '../extra-pages/custom.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// ==============================|| SAMPLE PAGE ||============================== //
//const [userData, setUserData] = useState([]);
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
// ==============================|| SAMPLE PAGE ||============================== //
const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#333333',
            paper: '#000000'
        },
        primary: {
            main: '#1890FF'
        },
        text: {
            primary: '#ffffff'
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: '#ffffff'
                    },
                    '& input': {
                        color: '#ffffff'
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#ffffff'
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#ffffff'
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: '#ffffff'
                    },
                    '& .MuiSelect-icon': {
                        color: '#ffffff'
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#ffffff'
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#ffffff'
                    }
                }
            }
        }
    }
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 16
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.common.black,
        maxWidth: '100px',
        overflow: 'auto'
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));
const User = () => {
    //const [userData, setUserData] = useState([]);

    const [data, setData] = useState([]);
    const getUsers = () => {
        getPortalUsers()
            .then((res) => {
                console.log(res.data);
                setData(res.data.users);
                // console.log(userData);
            })
            .catch((err) => {
                window.alert('Something went wrong');
            });
        console.log(data);
    };
    useEffect(() => {
        // setData(JSON.parse(localStorage.getItem('Users')));
        // console.log(JSON.parse(localStorage.getItem('Users')));
        //3fa328ea61533b6be5d27a92ba7880548db0fd84 -- comit log
        getUsers();
    }, []);

    const [modal, setModal] = useState(false);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    const handleModal = () => {
        setModal(!modal);
    };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setCPassword] = useState('');

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [wazuhChecked, setWazuhChecked] = useState(false);
    const [gophishChecked, setGophishChecked] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleAddress = (event) => {
        setAddress(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleCPasswordChange = (event) => {
        setCPassword(event.target.value);
    };

    const handleWazuhChange = (event) => {
        setWazuhChecked(event.target.checked);
    };

    const handleGophishChange = (event) => {
        setGophishChecked(event.target.checked);
    };
    const handleDeleteUser = (uname, auther) => {
        console.log(uname, auther);
        deletePortalUser(uname, auther)
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User Deleted successfully!',
                    showConfirmButton: true,
                    confirmButtonColor: 'rgb(88, 173, 198)'
                });
                getUsers();
            })
            .catch((error) => {
                Swal.fire('Oops', 'Something went wrong', 'error');
            });
    };

    const handleCreateUser = () => {
        if (!email || !password || !name || !confirmpassword || !address || (!wazuhChecked && !gophishChecked)) {
            Swal.fire('Failed', 'Fill All the Details', 'error');
        } else {
            if (password == confirmpassword) {
                const user = {
                    email,
                    password,
                    name,
                    wazuh: wazuhChecked,
                    gophish: gophishChecked,
                    address: address,
                    type: 'user',
                    auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
                };
                createPortalUser(user)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'User Created successfully!',
                            showConfirmButton: true,
                            confirmButtonColor: 'rgb(88, 173, 198)'
                        });
                        getUsers();
                        setModal(!modal);
                    })
                    .catch((error) => {
                        Swal.fire('Oops', error.response.data, 'error');
                    });
            } else {
                Swal.fire('Oops', 'Password and Confirm Password must be same', 'error');
                // window.alert('Password and Confirm Password must be same');
            }
        }
    };
    return (
        <>
            <MainCard title="User Management" style={{ width: '100%' }}>
                <Button variant="contained" onClick={handleModal} style={{ backgroundColor: '#58adc6', color: '#e1f1f5' }}>
                    Create User
                </Button>
                <Modal open={modal} onClose={handleModal}>
                    <div
                        style={{
                            height: '600px',
                            backgroundColor: 'rgb(36, 41, 57)'
                        }}
                        className="modal-container"
                    >
                        <ThemeProvider theme={theme}>
                            <Typography variant="h4" component="h4" className="my-2" style={{ textAlign: 'center' }}>
                                Create User
                            </Typography>
                            <br />
                            <TextField
                                label="Name"
                                value={name}
                                inputProps={{ style: { color: 'white' } }}
                                onChange={handleNameChange}
                                fullWidth
                                size="small"
                            />
                            <br />
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                inputProps={{ style: { color: 'white' } }}
                                onChange={handleEmailChange}
                                fullWidth
                                size="small"
                            />
                            <br />
                            <TextField
                                type="Password"
                                label="Password"
                                value={password}
                                inputProps={{ style: { color: 'white' } }}
                                onChange={handlePasswordChange}
                                fullWidth
                                size="small"
                            />
                            <br />
                            <TextField
                                type="Password"
                                label="Confirm Password"
                                value={confirmpassword}
                                inputProps={{ style: { color: 'white' } }}
                                onChange={handleCPasswordChange}
                                fullWidth
                                size="small"
                            />
                            <br />
                            <TextField
                                label="Address"
                                value={address}
                                inputProps={{ style: { color: 'white' } }}
                                onChange={handleAddress}
                                fullWidth
                                size="small"
                            />
                            <br />

                            <Typography variant="h6" component="h4" className="my-2">
                                Select Services
                            </Typography>
                            <div>
                                <Checkbox checked={wazuhChecked} onChange={handleWazuhChange} name="wazuh" />
                                SIEM
                                <Checkbox checked={gophishChecked} onChange={handleGophishChange} name="gophish" />
                                Phishing
                            </div>
                        </ThemeProvider>
                        <br />

                        <Button fullWidth variant="contained" style={{ backgroundColor: 'rgb(88, 173, 198)' }} onClick={handleCreateUser}>
                            Create User
                        </Button>
                    </div>
                </Modal>

                <style jsx>{`
                    .modal-container {
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        justify-content: center;
                        background-color: #000;
                        color: white;
                        padding: 20px;
                        width: 500px;
                        height: 300px;
                        margin: 20px auto;
                        outline: none;
                        border-radius: 5px;
                    }
                `}</style>

                <br />
                <br />
                <br />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>S.No</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">User Name/Email</StyledTableCell>
                                <StyledTableCell align="left">Address</StyledTableCell>
                                <StyledTableCell align="left">Resources</StyledTableCell>
                                <StyledTableCell align="left">Phishing ID</StyledTableCell>
                                <StyledTableCell align="left">Phishing API Key</StyledTableCell>
                                <StyledTableCell align="left">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.length > 0 &&
                                data?.map((e, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell component="th" scope="row">
                                            {i + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{e?.name}</StyledTableCell>
                                        <StyledTableCell align="left">{e?.username}</StyledTableCell>
                                        <StyledTableCell align="left">{e?.address ? e?.address : '-'}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            {' '}
                                            <ui>
                                                {(e.wazuh == 'true' || e.wazuh == 'True') && <li>SIEM</li>}
                                                {(e.gophish == 'true' || e.gophish == 'True') && <li>Phishing</li>}
                                            </ui>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{e?.gophishId}</StyledTableCell>
                                        <StyledTableCell align="left">{e.gophishapikey}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <IconButton
                                                onClick={() =>
                                                    handleDeleteUser(e?.gophishId, JSON.parse(localStorage.getItem('userdata'))?.gophishkey)
                                                }
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                {data?.length <= 0 && <h5 style={{ textAlign: 'center' }}>Fetching Data ...</h5>}
            </MainCard>
        </>
    );
};
export default User;
