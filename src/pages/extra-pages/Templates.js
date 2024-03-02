import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Modal, Box, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
// project import
import MainCard from 'components/MainCard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    createGroup,
    createTemplate,
    deleteGroup,
    deleteTemplate,
    editTemplate,
    getGroups,
    getGroupsSummary,
    getTemplates,
    importEmail
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
    bgcolor: 'rgb(36, 41, 57)',
    color: 'white !important',
    maxHeight: '500px',
    boxShadow: 24,
    p: 4,
    overflowX: 'hidden',
    overflowY: 'auto'
    // minHeight: "400px",
    // maxHeight: "600px",
};
export default function Templates() {
    const [open, setOpen] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [copyModal, setCopyModal] = React.useState(false);
    const [imports, setImports] = React.useState(false);
    const [convertLinks, setConvertLinks] = React.useState(true);
    const [trackingImage, setTrackingImage] = React.useState(true);
    const [name, setName] = React.useState('');
    const [emailSource, setEmailSource] = React.useState('');
    const [todos, setTodos] = useState([]);
    const [envelopSender, setEnvelopSender] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [html, setHtml] = useState('');
    const [position, setPosition] = useState('');
    const [id, setId] = useState(0);
    const [data, setData] = React.useState([]);
    const [groupSummary, setGroupSummary] = React.useState([]);
    const [editData, setEditData] = React.useState({});

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditModal(false);
        setText('');
        setHtml('');
        setId(0);
        setName('');
        setSubject('');
        setEnvelopSender('');
        setEmailSource('');
        setEditData({});
        setCopyModal(false);
    };
    const handleCheckClose = () => {
        setOpen(false);
    };
    const handleEdit = (e) => {
        e.preventDefault();
        setEditModal(false);
        if (name === '' || subject === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                id: id,
                name: name,
                subject: subject,
                text: text,
                envelope_sender: envelopSender,
                html: trackingImage ? html + ' ' + '<html><body><p>{{.Tracker}}</p></body></html>' : html,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
                // ...editData
            };
            editTemplate(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Template Updated successfully!',
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
        //setOpen(false);
        if (name === '' || subject === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                name: name,
                subject: subject,
                text: text,
                envelope_sender: envelopSender,
                html: trackingImage ? html + ' ' + '<html><body><p>{{.Tracker}}</p></body></html>' : html,
                auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
                // trackingImage,
            };
            console.log(trackingImage);
            createTemplate(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Template created successfully!',
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
        getTemplates()
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDeleteGroup = (i, auth) => {
        deleteTemplate(i, auth)
            .then((res) => {
                console.log(res);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Template deleted successfully!',
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

    const handleImportSite = () => {
        if (emailSource === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
            return;
        }
        let obj = {
            convert_links: convertLinks,
            content: emailSource,
            auth: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
        };
        importEmail(obj)
            .then((res) => {
                console.log(res.data);
                setText(res?.data.text);
                setHtml(res?.data.html);
                setSubject(res?.data.subject);
            })
            .catch((err) => {
                console.log(err);
                handleCheckClose();
                Swal.fire('Failed', err.response.data.message, 'error');
            });
    };

    const handleEditModal = (e, entry) => {
        if (entry == 'copy') {
            setCopyModal(true);
            setText(e?.text);
            setHtml(e?.html);
            setId(e?.id);
            setName(e?.name);
            setSubject(e?.subject);
            setEnvelopSender(e?.envelope_sender);
            // setEmailSource('');
            setEditData(e);
        } else {
            setEditModal(true);
            setText(e?.text);
            setHtml(e?.html);
            setId(e?.id);
            setName(e?.name);
            setSubject(e?.subject);
            setEnvelopSender(e?.envelope_sender);
            // setEmailSource('');
            setEditData(e);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <MainCard title="Users And Groups">
                <Card sx={{ maxWidth: 275 }} className="mb-3" style={{ color: 'black' }}>
                    <CardContent>
                        <Typography variant="h4" style={{ color: 'black' }} gutterBottom>
                            Templates Summary
                        </Typography>
                        <Typography variant="h5" component="div" color="text.secondary">
                            Total Templates : {data?.length}
                        </Typography>
                    </CardContent>
                </Card>
                <Button variant="contained" className="mb-3" onClick={handleOpen} style={{ backgroundColor: '#58adc6', color: '#e1f1f5' }}>
                    New Template
                </Button>

                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '41ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <ThemeProvider theme={theme}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Name
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Template Name"
                                    variant="outlined"
                                    style={{ color: 'black' }}
                                    color="primary"
                                    size="small"
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Button variant="contained" color="error" onClick={() => setImports(!imports)}>
                                    Import Email
                                </Button>

                                {imports && (
                                    <>
                                        {' '}
                                        <Typography id="modal-modal-title" variant="h4" component="h2">
                                            Email Content
                                        </Typography>
                                        <div class="col-sm-3">
                                            <textarea
                                                type="text"
                                                class="form-control"
                                                placeholder="Raw Email Source"
                                                id="emailSource"
                                                value={emailSource}
                                                rows="7"
                                                onChange={(e) => setEmailSource(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={convertLinks}
                                                id="flexCheckChecked"
                                                onChange={(e) => setConvertLinks(!convertLinks)}
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                                Change Links to Point to Landing Page
                                            </label>
                                        </div>
                                        <Button variant="contained" color="success" onClick={() => handleImportSite()}>
                                            Save{' '}
                                        </Button>
                                    </>
                                )}

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Envelope Sender
                                </Typography>

                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Address"
                                        id="firstName"
                                        value={envelopSender}
                                        onChange={(e) => setEnvelopSender(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Subject
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Subject"
                                        id="lastName"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        required
                                        rows={7}
                                        value={html}
                                        onChange={(e) => setHtml(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Text
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        rows={7}
                                        required
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {/* <div class="col-sm-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Position"
                                    id="position"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div> */}
                                {/* <Button variant="text" color="error" size="small" onClick={handleSubmit}>
                                <AddIcon fontSize="small" /> Add
                            </Button> */}
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={trackingImage}
                                        id="flexCheckChecked"
                                        onChange={(e) => setTrackingImage(!trackingImage)}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        Add Tracking Image
                                    </label>
                                </div>
                                <div className="container d-flex">
                                    <Button
                                        variant="contained"
                                        style={{ float: 'right', backgroundColor: '#58adc6', color: '#e1f1f5' }}
                                        onClick={handleAdd}
                                        fullWidth
                                    >
                                        Create Template
                                    </Button>
                                </div>
                            </ThemeProvider>
                        </Box>
                    </Box>
                </Modal>

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
                                '& > :not(style)': { m: 1, width: '41ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <ThemeProvider theme={theme}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Name
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Template Name"
                                    variant="outlined"
                                    style={{ color: 'black' }}
                                    color="primary"
                                    size="small"
                                    value={name}
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setName(e.target.value);
                                    }}
                                />

                                <Button variant="contained" color="error" onClick={() => setImports(!imports)}>
                                    Import Email
                                </Button>

                                {imports && (
                                    <>
                                        {' '}
                                        <Typography id="modal-modal-title" variant="h4" component="h2">
                                            Email Content
                                        </Typography>
                                        <div class="col-sm-3">
                                            <textarea
                                                type="text"
                                                class="form-control"
                                                placeholder="Raw Email Source"
                                                id="emailSource"
                                                value={emailSource}
                                                rows="7"
                                                onChange={(e) => setEmailSource(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={convertLinks}
                                                id="flexCheckChecked"
                                                onChange={(e) => setConvertLinks(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                                Change Links to Point to Landing Page
                                            </label>
                                        </div>
                                        <Button variant="contained" color="success" onClick={() => handleImportSite()}>
                                            Save{' '}
                                        </Button>
                                    </>
                                )}

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Envelope Sender
                                </Typography>

                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Address"
                                        id="firstName"
                                        value={envelopSender}
                                        onChange={(e) => setEnvelopSender(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Subject
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Subject"
                                        id="lastName"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        required
                                        rows={7}
                                        value={html}
                                        onChange={(e) => setHtml(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Text
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        rows={7}
                                        required
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {/* <div class="col-sm-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Position"
                                    id="position"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div> */}
                                {/* <Button variant="text" color="error" size="small" onClick={handleSubmit}>
                                <AddIcon fontSize="small" /> Add
                            </Button> */}
                                {/* <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={trackingImage}
                                    id="flexCheckChecked"
                                    onChange={(e) => setTrackingImage(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Add Tracking Image
                                </label>
                            </div> */}
                                <br />
                                <div className="container d-flex">
                                    <Button
                                        variant="contained"
                                        style={{ float: 'right', backgroundColor: '#58adc6', color: '#e1f1f5' }}
                                        onClick={handleEdit}
                                        fullWidth
                                    >
                                        Update Template
                                    </Button>
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
                                '& > :not(style)': { m: 1, width: '41ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <ThemeProvider theme={theme}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Name
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Template Name"
                                    variant="outlined"
                                    style={{ color: 'black' }}
                                    color="primary"
                                    size="small"
                                    value={name}
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setName(e.target.value);
                                    }}
                                />

                                <Button variant="contained" color="error" onClick={() => setImports(!imports)}>
                                    Import Email
                                </Button>

                                {imports && (
                                    <>
                                        {' '}
                                        <Typography id="modal-modal-title" variant="h4" component="h2">
                                            Email Content
                                        </Typography>
                                        <div class="col-sm-3">
                                            <textarea
                                                type="text"
                                                class="form-control"
                                                placeholder="Raw Email Source"
                                                id="emailSource"
                                                value={emailSource}
                                                rows="7"
                                                onChange={(e) => setEmailSource(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={convertLinks}
                                                id="flexCheckChecked"
                                                onChange={(e) => setConvertLinks(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                                Change Links to Point to Landing Page
                                            </label>
                                        </div>
                                        <Button variant="contained" color="success" onClick={() => handleImportSite()}>
                                            Save{' '}
                                        </Button>
                                    </>
                                )}

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Envelope Sender
                                </Typography>

                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Address"
                                        id="firstName"
                                        value={envelopSender}
                                        onChange={(e) => setEnvelopSender(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Subject
                                </Typography>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Email Subject"
                                        id="lastName"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    HTML
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        required
                                        rows={7}
                                        value={html}
                                        onChange={(e) => setHtml(e.target.value)}
                                    />
                                </div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Text
                                </Typography>
                                <div class="col-sm-3">
                                    <textarea
                                        type="email"
                                        class="form-control"
                                        placeholder="Plain Text"
                                        id="email"
                                        rows={7}
                                        required
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                                {/* <div class="col-sm-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Position"
                                    id="position"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div> */}
                                {/* <Button variant="text" color="error" size="small" onClick={handleSubmit}>
                                <AddIcon fontSize="small" /> Add
                            </Button> */}
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={trackingImage}
                                        id="flexCheckChecked"
                                        onChange={(e) => setTrackingImage(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        Add Tracking Image
                                    </label>
                                </div>
                                <div className="container d-flex">
                                    <Button
                                        variant="contained"
                                        style={{ float: 'right', backgroundColor: '#58adc6', color: '#e1f1f5' }}
                                        onClick={handleAdd}
                                        fullWidth
                                    >
                                        Create Template
                                    </Button>
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
                                            <IconButton onClick={() => handleEditModal(e, 'edit')}>
                                                <EditIcon color="success" />
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
            </MainCard>
        </>
    );
}
