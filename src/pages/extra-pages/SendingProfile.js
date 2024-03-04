import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Modal, Box, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
// project import
import MainCard from 'components/MainCard';
import {
    createGroup,
    createPage,
    createSendingProfile,
    createTemplate,
    deleteGroup,
    deleteSendingProfile,
    editSendingProfile,
    getGroups,
    getGroupsSummary,
    getPages,
    getSendingProfile,
    getTemplates
} from 'api/api';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
            primary: '#888'
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: '#888'
                    },
                    '& input': {
                        color: '#888'
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: '#888'
                    },
                    '& .MuiSelect-icon': {
                        color: '#888'
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#888'
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#888'
                    }
                }
            }
        }
    }
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#89a',
        color: theme.palette.common.white,
        fontSize: 15,
        fontFamily: 'Open Sans'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#444',
        maxWidth: '100px',
        overflow: 'auto',
        padding: '10px 12px',
        fontFamily: 'Open Sans'
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
    bgcolor: '#fff',
    color: '#888 !important',
    maxHeight: '600px',
    boxShadow: 24,
    p: 4,
    overflowX: 'auto',
    overflowY: 'auto'
    // minHeight: "400px",
    // maxHeight: "600px",
};
export default function SendingProfile() {
    const [open, setOpen] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [editData, setEditData] = React.useState(false);
    const [name, setName] = React.useState('');
    const [headers, setHeaders] = useState([]);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [host, setHost] = useState('');
    const [fromAddress, setFromAddress] = useState('');
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [ignoreError, setIgnoreError] = useState(false);
    const [position, setPosition] = useState('');
    const [data, setData] = React.useState([]);
    const [groupSummary, setGroupSummary] = React.useState([]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditModal(false);
        setName('');
    };
    const handleCheckClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        setOpen(false);
        if (name === '' || host === '' || fromAddress === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                name: name,
                host: host,
                from_address: fromAddress,
                headers: headers,
                username: userName,
                password: password,
                interface_type: 'SMTP',
                ignore_cert_errors: ignoreError,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
            };

            createSendingProfile(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Profile created successfully!',
                        showConfirmButton: true,
                        timer: 2000,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    fetchUser();
                    handleClose();
                })
                .catch((err) => {
                    console.log(err);
                    handleCheckClose();
                    Swal.fire('Failed', err.response.data.message, 'error');
                });
        }
    };
    const handleEdit = () => {
        setEditModal(false);
        if (name === '' || host === '' || fromAddress === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                ...editData,
                name: name,
                host: host,
                from_address: fromAddress,
                headers: headers,
                username: userName,
                password: password,
                interface_type: 'SMTP',
                ignore_cert_errors: ignoreError,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
            };

            editSendingProfile(obj, editData?.id)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Sending Profile Updated Successfully!',
                        showConfirmButton: true,
                        timer: 2000,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    fetchUser();
                    handleClose();
                })
                .catch((err) => {
                    console.log(err);
                    handleCheckClose();
                    Swal.fire('Failed', err.response.data.message, 'error');
                });
        }
    };
    function handleSubmit(e) {
        e.preventDefault();
        if (key !== '' || value !== '') {
            let header = { key: key, value: value };

            setHeaders([...headers, header]);
            setKey('');
            setValue('');
            // setEmail('');
            // setPosition('');
        }
    }
    function handleDelete(i) {
        setHeaders(headers.filter((todo, index) => index !== i));
    }
    const fetchUser = () => {
        getSendingProfile()
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDeleteGroup = (i, auth) => {
        deleteSendingProfile(i, auth)
            .then((res) => {
                console.log(res);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile deleted successfully!',
                    showConfirmButton: true,
                    timer: 2000,
                    confirmButtonColor: 'rgb(88, 173, 198)'
                });
                fetchUser();
            })
            .catch((err) => {
                console.log(err);
                Swal.fire('Failed', err.response.data.message, 'error');
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        console.log(ignoreError);
    }, [ignoreError]);

    const handleEditModal = (e) => {
        setEditModal(true);
        setName(e?.name);
        setHost(e?.host);
        setFromAddress(e?.from_address);
        setUserName(e?.username);
        setPassword(e?.password);
        setIgnoreError(e?.ignore_cert_errors);
        setHeaders(e?.headers);
        setEditData(e);
    };

    return (
        <>
            <MainCard title="Users And Groups" style={{ width: '100%', borderRadius: 0, boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)', padding: '16px' }}>
                <Card sx={{ maxWidth: 275 }} className="mb-3" style={{ color: 'black' }}>
                    <CardContent>
                        <Typography variant="h4" style={{ color: '#555', fontWeight: 400 }} gutterBottom>
                            Sending Profile
                        </Typography>
                        <Typography variant="h5" component="div" color="#888">
                            Total Profiles : {data?.length}
                        </Typography>
                    </CardContent>
                </Card>
                <Button variant="contained" className='btn btn-primary shadow px-sm-4 mb-3' onClick={handleOpen}>
                    New Profile
                </Button>
                {/* <Typography variant="h6" component="div" color="text.secondary">
                    If not created you can do it on gophish admin panel. This issue occurs when browser not able to verify gophish
                    self-signed SSL certificate.
                </Typography> */}

                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <ThemeProvider theme={theme}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Name *
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Sending Profile Name"
                                    variant="outlined"
                                    style={{ color: 'black' }}
                                    color="primary"
                                    size="small"
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Host *
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="sample.smtp.com:25"
                                        id="email"
                                        required
                                        value={host}
                                        onChange={(e) => setHost(e.target.value)}
                                    />
                                </div>

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    From address *
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="From Address"
                                        id="email"
                                        required
                                        value={fromAddress}
                                        onChange={(e) => setFromAddress(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Interface Type
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Interface Type"
                                        id="email"
                                        required
                                        value="SMTP"
                                        disabled
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    UserName
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Username"
                                        id="email"
                                        required
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Password
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="password"
                                        class="form-control"
                                        placeholder="Password"
                                        id="email"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="flexCheckChecked"
                                        value={ignoreError}
                                        onChange={(e) => {
                                            // console.log(ignoreError);
                                            setIgnoreError(!ignoreError);
                                        }}
                                    />
                                    <label class="form-check-label " htmlFor="flexCheckChecked">
                                        Ignore Certificate Error
                                    </label>
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Email Headers
                                </Typography>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-sm">
                                            <input
                                                className="form-control"
                                                placeholder="X-Custom-Header"
                                                value={key}
                                                onChange={(e) => setKey(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-sm">
                                            <input
                                                className="form-control"
                                                placeholder="{{.URL}}-gophish"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-sm">
                                            <button className='btn btn-primary px-sm-4 bg-brand-color-1' onClick={handleSubmit}>
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <table className="table table-hover mt-4" style={{ color: 'white' }}>
                                    <thead class="thead-dark">
                                        <tr>
                                            <td>Headers</td>

                                            <td>Value</td>
                                            <td>Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {headers?.length > 0 &&
                                            headers?.map((e, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{e.key}</td>

                                                        <td>{e.value}</td>
                                                        <td>
                                                            <DeleteIcon color="error" onClick={() => handleDelete(i)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                                {headers?.length < 1 && <p className="text-center">No data available in table</p>}
                                <br />
                                <div className="container d-flex">
                                    <button
                                        className='btn btn-primary shadow px-sm-4 mx-auto'
                                        onClick={handleAdd}
                                    >
                                        Create Sending Profile
                                    </button>
                                </div>
                            </ThemeProvider>
                        </Box>
                    </Box>
                </Modal>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="left">Modified Date</StyledTableCell>
                                <StyledTableCell align="left">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.length > 0 &&
                                data?.map((e, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell component="th" scope="row">
                                            {e?.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{new Date(e.modified_date).toUTCString()}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <IconButton onClick={() => handleEditModal(e)}>
                                                <EditIcon color="success" />
                                                {/* <DeleteIcon color="error" /> */}
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDeleteGroup(e?.id, JSON.parse(localStorage.getItem('userdata'))?.gophishkey)
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

                <Modal
                    open={editModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <ThemeProvider theme={theme}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Name *
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Sending Profile Name"
                                    variant="outlined"
                                    style={{ color: 'black' }}
                                    color="primary"
                                    size="small"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Host *
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Host"
                                        id="email"
                                        required
                                        value={host}
                                        onChange={(e) => setHost(e.target.value)}
                                    />
                                </div>

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    From address *
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="From Address"
                                        id="email"
                                        required
                                        value={fromAddress}
                                        onChange={(e) => setFromAddress(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Interface Type
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Interface Type"
                                        id="email"
                                        required
                                        value="SMTP"
                                        disabled
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    UserName
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Username"
                                        id="email"
                                        required
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Password
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="password"
                                        class="form-control"
                                        placeholder="Password"
                                        id="email"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="flexCheckChecked"
                                        checked={ignoreError}
                                        onChange={(e) => {
                                            // console.log(ignoreError);
                                            setIgnoreError(!ignoreError);
                                        }}
                                    />
                                    <label class="form-check-label " htmlFor="flexCheckChecked">
                                        Ignore Certificate Error
                                    </label>
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Email Headers
                                </Typography>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-sm">
                                            <input
                                                className="form-control"
                                                placeholder="X-Custom-Header"
                                                value={key}
                                                onChange={(e) => setKey(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-sm">
                                            <input
                                                className="form-control"
                                                placeholder="{{.URL}}-gophish"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-sm">
                                            <Button variant="contained" fullWidth color="error" onClick={handleSubmit}>
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <table className="table table-hover mt-4" style={{ color: 'white' }}>
                                    <thead class="thead-dark">
                                        <tr>
                                            <td>Headers</td>

                                            <td>Value</td>
                                            <td>Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {headers?.length > 0 &&
                                            headers?.map((e, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{e.key}</td>

                                                        <td>{e.value}</td>
                                                        <td>
                                                            <DeleteIcon color="error" onClick={() => handleDelete(i)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                                {headers?.length < 1 && <p className="text-center">No data available in table</p>}

                                <br />
                                <div className="container d-flex">
                                    <Button
                                        variant="contained"
                                        style={{ float: 'right', backgroundColor: '#58adc6', color: '#e1f1f5' }}
                                        onClick={handleEdit}
                                        fullWidth
                                    >
                                        Update Sending Profile
                                    </Button>
                                </div>
                            </ThemeProvider>
                        </Box>
                    </Box>
                </Modal>
            </MainCard>
        </>
    );
}
