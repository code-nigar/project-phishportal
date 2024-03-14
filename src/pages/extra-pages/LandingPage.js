import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Modal, Box, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
// project import
import MainCard from 'components/MainCard';

import DOMPurify from 'dompurify';
import {
    createGroup,
    createPage,
    createTemplate,
    deleteGroup,
    deletePage,
    editPage,
    getGroups,
    getGroupsSummary,
    getPages,
    getTemplates,
    importSite
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
import FullScreenDialog from './FullScreenModal/FullScreenModal';
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
export default function LandingPage() {
    const [open, setOpen] = React.useState(false);
    const [imports, setImport] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [copyModal, setCopyModal] = React.useState(false);
    const [previewModal, setPreviewModal] = React.useState(false);
    const [name, setName] = React.useState('');
    const [textUrl, setTextUrl] = React.useState('');
    const [todos, setTodos] = useState([]);
    const [envelopSender, setEnvelopSender] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [id, setId] = useState(0);
    const [position, setPosition] = useState('');
    const [data, setData] = React.useState([]);
    const [groupSummary, setGroupSummary] = React.useState([]);
    const [editData, setEditData] = React.useState({});
    const [captureData, setCaptureData] = React.useState(true);
    const [redirectURL, setRedirectURL] = React.useState('');

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditModal(false);
        setText('');
        setId(0);
        setName('');
        setEditData({});
        setCopyModal(false);
    };
    const handleCheckClose = () => {
        setOpen(false);
    };
    const handleEdit = () => {
        setEditModal(false);
        if (name === '' || text === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                ...editData,
                name: name,
                html: text,
                capture_credentials: captureData ? true : false,
                capture_passwords: captureData ? true : false,
                redirect_url: redirectURL,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
            };
            console.log(obj);
            console.log(typeof id);
            editPage(obj, id)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Page Updated Successfully!',
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
    const handleAdd = () => {
        setOpen(false);

        if (name === '' || text === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                name: name,
                text: text,
                capture_credentials: captureData ? true : false,
                capture_passwords: captureData ? true : false,
                redirect_url: redirectURL,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
            };
            console.log(obj);
            createPage(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Page created successfully!',
                        showConfirmButton: true,
                        timer: 2000,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    fetchUser();
                    handleClose();
                    setImport(false);
                })
                .catch((err) => {
                    console.log(err);
                    handleCheckClose();
                    Swal.fire('Failed', err.response.data.message, 'error');
                });
        }
    };

    function stringToHtml(htmlString) {
        const sanitizedHtml = DOMPurify.sanitize(htmlString);
        return <div id="summary1" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    }

    const handleImportSite = () => {
        if (textUrl === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
            return;
        }
        let obj = {
            include_resources: false,
            url: textUrl,
            auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
        };
        importSite(obj)
            .then((res) => {
                console.log(res.data);
                setText(res?.data.html);
            })
            .catch((err) => {
                console.log(err);
                handleCheckClose();
                Swal.fire('Failed', err?.response?.data?.message, 'error');
            });
    };

    function handleSubmit(e) {
        e.preventDefault();
        if (fname !== '' || lname !== '' || email !== '' || position !== '') {
            let todo = { first_name: fname, last_name: lname, email: email, position: position };

            setTodos([...todos, todo]);
            setFname('');
            setLname('');
            setEmail('');
            setPosition('');
        }
    }
    function handleDelete(i) {
        setTodos(todos.filter((todo, index) => index !== i));
    }
    const fetchUser = () => {
        getPages()
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDeleteGroup = (i, auth) => {
        deletePage(i, auth)
            .then((res) => {
                console.log(res);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Page deleted successfully!',
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

    const handleEditModal = (e, entry) => {
        if (entry == 'copy') {
            setCopyModal(true);
            setName(e?.name);
            setText(e?.html);
            setId(e?.id);
            setEditData(e);
        } else {
            setEditModal(true);
            setName(e?.name);
            setText(e?.html);
            setId(e?.id);
            setEditData(e);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <MainCard title="Users And Groups" style={{ width: '100%', borderRadius: 0, boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)', padding: '16px' }}>
                <Card sx={{ maxWidth: 275 }} className="mb-3" style={{ color: 'black' }}>
                    <CardContent>
                        <Typography variant="h4" style={{ color: '#555', fontWeight: 400 }} gutterBottom>
                            Landing Page Summary
                        </Typography>
                        <Typography variant="h5" component="div" color="#888">
                            Total Pages : {data?.length}
                        </Typography>
                    </CardContent>
                </Card>
                <Button variant="contained" className='btn btn-primary shadow px-sm-4 mb-3' onClick={handleOpen}>
                    New Page
                </Button>

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
                                    Name
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Landing Page"
                                    id="LandingPage"
                                    label="Landing Page"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button className='btn btn-primary px-sm-4 bg-brand-color-1' onClick={() => setImport(!imports)}>
                                    Import Site
                                </button>
                                {imports && (
                                    <>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Enter URL
                                        </Typography>
                                        <div class="col-sm-3">
                                            <textarea
                                                type="email"
                                                class="form-control"
                                                placeholder="https://google.com"
                                                id="url"
                                                required
                                                rows={1}
                                                value={textUrl}
                                                onChange={(e) => setTextUrl(e.target.value)}
                                            />
                                            <br />
                                            <Button
                                                variant="contained"
                                                className='btn btn-primary px-sm-4 mb-2'
                                                onClick={() => handleImportSite()}
                                            >
                                                Import{' '}
                                            </Button>
                                        </div>
                                    </>
                                )}
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        style={{ width: '100%' }}
                                        type="email"
                                        class="form-control"
                                        placeholder="HTML"
                                        id="email"
                                        required
                                        rows={7}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {/* {text && stringToHtml(text)} */}
                                {text && <FullScreenDialog text={text} style={{ backgroundColor: 'white !important' }} />} 
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Redirect URL
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Redirect URL"
                                    id="redirectURL"
                                    label="Redirect URL"
                                    value={redirectURL}
                                    onChange={(e) => setRedirectURL(e.target.value)}
                                />
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={captureData}
                                        id="flexCheckChecked"
                                        onChange={(e) => setCaptureData(!captureData)}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        Capture Submitted Data
                                    </label>
                                </div>
                                <br />
                                <div className="container d-flex">
                                    <button
                                        className='btn btn-primary shadow px-sm-4 mx-auto'
                                        onClick={handleAdd}
                                    >
                                        Create Page
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
                                <StyledTableCell align="left">Redirect URL</StyledTableCell>
                                <StyledTableCell align="left">Captured Credentials</StyledTableCell>
                                <StyledTableCell align="left">Captured Password</StyledTableCell>
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
                                        <StyledTableCell align="left">{e.redirect_url !== '' ? e.redirect_url : 'None'}</StyledTableCell>
                                        <StyledTableCell align="left">{e.capture_credentials === false ? 'False' : 'True'}</StyledTableCell>
                                        <StyledTableCell align="left">{e.capture_passwords === false ? 'False' : 'True'}</StyledTableCell>
                                        <StyledTableCell align="left">{new Date(e.modified_date).toUTCString()}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <IconButton onClick={() => handleEditModal(e, 'edit')}>
                                                <EditIcon color="success" />
                                                {/* <DeleteIcon color="error" /> */}
                                            </IconButton>
                                            <IconButton onClick={() => handleEditModal(e, 'copy')}>
                                                <ContentCopyIcon color="primary" />
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
                                    Name
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Landing Page"
                                    id="LandingPage"
                                    label="Landing Page"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="HTML"
                                        id="email"
                                        required
                                        rows={7}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {text && <FullScreenDialog text={text} style={{ backgroundColor: 'white !important' }} />} 
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Redirect URL
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Redirect URL"
                                    id="redirectURL"
                                    value={redirectURL || editData.redirect_url}
                                    onChange={(e) => setRedirectURL(e.target.value)}
                                />
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={editData.capture_credentials}
                                        id="flexCheckChecked"
                                        onChange={(e) => setCaptureData(!editData.capture_credentials)}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        Capture Submitted Data
                                    </label>
                                </div>
                                <br />
                                <div className="container d-flex">
                                    <button
                                        className='btn btn-primary shadow px-sm-4 mx-auto'
                                        onClick={handleEdit}
                                        fullWidth
                                    >
                                        Update Page
                                    </button>
                                </div>
                            </ThemeProvider>
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={copyModal}
                    onClose={() => {
                        setCopyModal(false);
                    }}
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
                                    Name
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Landing Page"
                                    id="LandingPage"
                                    label="Landing Page"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="HTML"
                                        id="email"
                                        required
                                        rows={7}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {text && <FullScreenDialog text={text} style={{ backgroundColor: 'white !important' }} />} 
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Redirect URL
                                </Typography>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Redirect URL"
                                    id="redirectURL"
                                    value={redirectURL || editData.redirect_url}
                                    onChange={(e) => setRedirectURL(e.target.value)}
                                />
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={editData.capture_credentials}
                                        id="flexCheckChecked"
                                        onChange={(e) => setCaptureData(!editData.capture_credentials)}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        Capture Submitted Data
                                    </label>
                                </div>
                                <div className="container d-flex">
                                    <button
                                        className='btn btn-primary shadow px-sm-4 mt-2 mx-auto'
                                        onClick={handleAdd}
                                        fullWidth
                                    >
                                        Create Page
                                    </button>
                                </div>
                            </ThemeProvider>
                        </Box>
                    </Box>
                </Modal>
            </MainCard>
        </>
    );
}
