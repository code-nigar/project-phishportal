import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Modal, Box, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tag } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// project import
import { DonutChart } from 'react-circle-chart';
import { useNavigate } from 'react-router-dom';
import './custom.css';

import MainCard from 'components/MainCard';
import {
    createCompaign,
    createGroup,
    createTemplate,
    deleteCompaign,
    deleteGroup,
    getCompaignResult,
    getCompaigns,
    getGroups,
    getGroupsSummary,
    getPages,
    getSendingProfile,
    getTemplates,
    getCompaignSummary,
    getCompleteCompaign,
    getAllCampaignSummary,
    getAllCompaignResult
} from 'api/api';
import Swal from 'sweetalert2';
import { useParams } from 'react-router';
import DataTable from './DataGrid';

const newstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    bgcolor: 'background.paper',

    boxShadow: 24,
    p: 4
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
    bgcolor: 'rgb(36, 41, 57)',
    color: 'white !important',

    boxShadow: 24,
    p: 4,
    overflowX: 'hidden',
    overflowY: 'auto',
    // minHeight: "400px",
    maxHeight: '600px'
};

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    }
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];

export default function CompaignsResult() {
    const [open, setOpen] = React.useState(false);
    const [testEmailopen, setTestEmailopen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [todos, setTodos] = useState([]);
    const [envelopSender, setEnvelopSender] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [emailTemplate, setEmailTemplate] = useState('');
    const [lPage, setLPage] = useState('');
    const [url, setURL] = useState('');
    const [lDate, setLDate] = useState('');
    const [sendEmails, setSendEmails] = useState('');
    const [sendProfile, setSendProfile] = useState('');
    const [group, setGroup] = useState('');

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [templates, setTemplates] = React.useState([]);
    const [pages, setPages] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const [sendingProfile, setSendingProfile] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [summary, setSummary] = React.useState({});
    const [result, setResult] = React.useState([]);
    const [newModal, setNewModal] = React.useState(false);
    const [eve, setEvents] = React.useState({});

    console.log(result);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setName('');
    };
    const handleCheckClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        setOpen(false);
        if (name === '' || emailTemplate === '' || url === '' || lPage === '' || sendProfile === '' || group === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            const date = new Date(lDate);
            const send_by_date = new Date(sendEmails);

            // Convert the date to the UTC time zone
            const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            const sendDate = new Date(send_by_date.getTime() + send_by_date.getTimezoneOffset() * 60000);
            console.log(utcDate.toISOString());
            let obj = {
                name: name,
                template: { name: emailTemplate },
                url: url,
                page: { name: lPage },
                smtp: { name: sendProfile },
                launch_date: utcDate.toISOString(),
                send_by_date: sendDate.toISOString(),
                groups: [{ name: group }]
            };
            console.log(obj);
            createCompaign(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Compaign created successfully!',
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
    const { id } = useParams();
    const fetchUser = () => {
        getCompaignResult(id)
            .then((res) => {
                console.log(res.data);
                setResult(res.data);
            })

            .catch((err) => {
                console.log(err);
            });
    };
    const handleDeleteGroup = () => {
        deleteCompaign(id)
            .then((res) => {
                console.log(res);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Compaign deleted successfully!',
                    showConfirmButton: true,
                    timer: 2000,
                    confirmButtonColor: 'rgb(88, 173, 198)'
                });
                navigate(-1);
            })
            .catch((err) => {
                console.log(err);
                Swal.fire('Failed', err.response.data.message, 'error');
            });
    };
    const handleNewModal = (i) => {
        setNewModal(true);
        setEvents(result?.results[i]);
        console.log(result?.results[i]);
    };
    const navigate = useNavigate();

    const [arr, setArr] = React.useState([]);
    const [stats, setStats] = React.useState({
        clicked: 0,
        sent: 0,
        opened: 0,
        submitted_data: 0,
        email_reported: 0
    });
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        getAllCampaignSummary()
            .then((res) => {
                console.log(res.data.campaigns);
                let updatedArr = [];
                res.data.campaigns.map((e) => {
                    stats.sent += e.stats.sent;
                    updatedArr.push({ id: e.id, name: e.name, status: e.status });

                    stats.clicked += e.stats.clicked;
                    stats.opened += e.stats.opened;
                    stats.submitted_data += e.stats.submitted_data;
                    stats.email_reported += e.stats.email_reported;
                    setStats({ ...stats });
                });
                setArr([...updatedArr]);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(async () => {
        let i = 0;
        let updatedRows = [];

        // console.log(updatedRows);
    }, [arr]);

    useEffect(() => {
        console.log(rows);
    }, [rows]);

    const handleNavigate = (i) => {
        navigate(-1);
    };
    const handleComplete = (i) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(88, 173, 198)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Complete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                getCompleteCompaign(id)
                    .then((res) => {
                        Swal.fire('Completed!', 'Your Campaign has been Completed.', 'success');
                        console.log(res);
                        navigate(-1);
                    })
                    .catch((err) => {
                        Swal.fire('Failed!', 'Could Not Delete.', 'error');
                    });
            }
        });
    };

    function findLastOccurrence(array, searchValue) {
        for (let i = array.length - 1; i >= 0; i--) {
            const values = Object.values(array[i]);
            if (values.includes(searchValue)) {
                console.log(array[i]);
                return array[i];
            }
        }
        return null;
    }

    useEffect(() => {
        fetchUser();
    }, []);

    setTimeout(() => {
        fetchUser();
    }, 9000000);

    return (
        <>
            <MainCard title="Users And Groups">
                <div>
                    <Button variant="contained" className="me-3 mb-3" style={{ backgroundColor: 'grey' }} onClick={handleNavigate}>
                        Back
                    </Button>
                    {result?.status !== 'Completed' && (
                        <Button variant="contained" className="mx-3 mb-3" onClick={handleComplete}>
                            Complete
                        </Button>
                    )}
                    <Button variant="contained" className="mx-3 mb-3" onClick={handleDeleteGroup} color="error">
                        Delete
                    </Button>
                </div>

                <Card sx={{ maxWidth: 275 }} className="mb-3" style={{ color: 'black' }}>
                    <CardContent>
                        <Typography variant="h4" style={{ color: 'black' }} gutterBottom>
                            {result?.name} Compaign Result Summary
                        </Typography>
                        <Typography variant="h5" component="div" color="text.secondary">
                            Total Victims : {summary?.stats?.total}
                        </Typography>
                    </CardContent>
                </Card>
                {/* <Button variant="contained" className="mb-3" onClick={handleOpen}>
                    New Compaign
                </Button> */}

                <div className="d-flex justify-content-around align-items-center my-5">
                    <div className="d-flex align-items-between">
                        <div>
                            <h6>Sent</h6>
                        </div>
                        {/* <Doughnut
                            data={{
                                labels: ['sent'],
                                datasets: [
                                    {
                                        label: 'sent',
                                        data: [2],
                                        backgroundColor: ['blue'],
                                        borderColor: ['green'],
                                        borderWidth: 1
                                    }
                                ]
                            }}
                            height={20}
                            width={20}
                        /> */}
                        <DonutChart
                            trackColor="#cdcdcd"
                            size="130"
                            totalFontSize="22px"
                            tooltipFontSize="16px"
                            roundedCaps={false}
                            showTotal={true}
                            backgroundTooltipColor="#000000"
                            items={[
                                {
                                    value: stats?.sent || 0,
                                    label: 'Email Sent',
                                    color: '#45B275'
                                }
                            ]}
                        />
                    </div>

                    <div className="d-flex align-items-between">
                        {/* <h6>Opened</h6> */}
                        <div>
                            <h6>Opened</h6>
                        </div>
                        <DonutChart
                            trackColor="#cdcdcd"
                            totalFontSize="22px"
                            tooltipFontSize="16px"
                            size="130"
                            roundedCaps={false}
                            showTotal={true}
                            backgroundTooltipColor="#000000"
                            items={[
                                {
                                    value: stats?.opened || 0,
                                    label: 'Email Opened',
                                    color: 'yellow'
                                }
                            ]}
                        />
                    </div>
                    <div className="d-flex align-items-between">
                        {/* <h6>Clicked</h6> */}
                        <div>
                            <h6>Clicked</h6>
                        </div>
                        <DonutChart
                            trackColor="#cdcdcd"
                            size="130"
                            totalFontSize="22px"
                            tooltipFontSize="16px"
                            roundedCaps={false}
                            showTotal={true}
                            backgroundTooltipColor="#000000"
                            items={[
                                {
                                    value: stats?.clicked || 0,
                                    label: 'Clicked Link',
                                    color: '#FFB35B'
                                }
                            ]}
                        />
                    </div>

                    <div className="d-flex align-items-between">
                        {/* <h6>Submit</h6> */}
                        <div>
                            <h6>Submit</h6>
                        </div>
                        <DonutChart
                            trackColor="#cdcdcd"
                            size="130"
                            showTotal={true}
                            backgroundTooltipColor="#000000"
                            totalFontSize="22px"
                            tooltipFontSize="16px"
                            roundedCaps={false}
                            items={[
                                {
                                    value: stats?.submitted_data || 0,
                                    label: 'Submitted Data',
                                    color: '#FF5B35'
                                }
                            ]}
                        />
                    </div>

                    <div className="d-flex align-items-between">
                        {/* <h6>Reported</h6> */}
                        <div>
                            <h6>Reported</h6>
                        </div>
                        <DonutChart
                            trackColor="#cdcdcd"
                            size="130"
                            showTotal={true}
                            backgroundTooltipColor="#000000"
                            totalFontSize="22px"
                            tooltipFontSize="16px"
                            roundedCaps={false}
                            items={[
                                {
                                    value: stats?.email_reported || 0,
                                    label: 'Email Reported'
                                }
                            ]}
                        />
                    </div>
                </div>

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
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Name
                            </Typography>
                            <TextField
                                id="outlined-basic"
                                label="Compaign Name"
                                variant="outlined"
                                style={{ color: 'black' }}
                                color="primary"
                                size="small"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Email Template
                            </Typography>

                            <div class="col-sm-3">
                                <select
                                    type="text"
                                    class="form-control"
                                    placeholder="Select Email Template"
                                    id="firstName"
                                    onBlur={(e) => setEmailTemplate(e.target.value)}
                                >
                                    <option value="" disabled selected>
                                        Select Email Template
                                    </option>
                                    {templates?.map((e, i) => (
                                        <option key={i} value={e.name}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Landing Page
                            </Typography>
                            <div class="col-sm-3">
                                <select
                                    type="text"
                                    class="form-control"
                                    placeholder="Select Landing Page"
                                    id="firstName"
                                    onBlur={(e) => setLPage(e.target.value)}
                                >
                                    <option value="" disabled selected>
                                        Select Landing Page
                                    </option>
                                    {pages?.map((e, i) => (
                                        <option key={i} value={e.name}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                URL
                            </Typography>
                            <div class="col-sm-3">
                                <input
                                    type="email"
                                    class="form-control"
                                    placeholder="http://192.168.0.107"
                                    id="ip"
                                    required
                                    value={url}
                                    onChange={(e) => setURL(e.target.value)}
                                />
                            </div>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Launch Date
                            </Typography>
                            <div class="col-sm-3">
                                <input
                                    type="datetime-local"
                                    class="form-control"
                                    placeholder="Select Launch Date"
                                    id="ip"
                                    required
                                    value={lDate}
                                    onChange={(e) => setLDate(e.target.value)}
                                />
                            </div>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Send Emails By (Optional)
                            </Typography>
                            <div class="col-sm-3">
                                <input
                                    type="datetime-local"
                                    class="form-control"
                                    placeholder="Select Launch Date"
                                    id="ip"
                                    value={sendEmails}
                                    onChange={(e) => setSendEmails(e.target.value)}
                                />
                            </div>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Sending Profile
                            </Typography>
                            <div class="col-sm-3">
                                <select
                                    type="text"
                                    class="form-control"
                                    placeholder="Select Landing Page"
                                    id="firstName"
                                    onBlur={(e) => setSendProfile(e.target.value)}
                                >
                                    <option value="" disabled selected>
                                        Select Sending Profile
                                    </option>
                                    {sendingProfile?.map((e, i) => (
                                        <option key={i} value={e.name}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* <Button variant="contained" color="error" onClick={() => setTestEmailopen(true)}>
                                Send Test Email{' '}
                            </Button> */}
                            <Modal
                                open={testEmailopen}
                                onClose={() => setTestEmailopen(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={newstyle}>
                                    <Typography id="modal-modal-title" variant="h4" component="h2">
                                        Send Test Email
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Send Test Email to:
                                        <div className="container my-2">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <input
                                                        placeholder="First Name"
                                                        className="form-control"
                                                        onChange={(e) => setFname(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        placeholder="Last Name"
                                                        className="form-control"
                                                        onChange={(e) => setLname(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        placeholder="Email"
                                                        className="form-control"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        placeholder="Position"
                                                        className="form-control"
                                                        onChange={(e) => setPosition(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <Button variant="contained" className="mt-2">
                                                Send
                                            </Button>
                                        </div>
                                    </Typography>
                                </Box>
                            </Modal>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Groups
                            </Typography>
                            <div class="col-sm-3">
                                <select
                                    type="text"
                                    class="form-control"
                                    placeholder="Select Landing Page"
                                    id="firstName"
                                    onBlur={(e) => setGroup(e.target.value)}
                                >
                                    <option value="" disabled selected>
                                        Select Group
                                    </option>
                                    {groups?.map((e, i) => (
                                        <option key={i} value={e.name}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
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

                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#70d8bd'
                                    // color: "black"
                                }}
                                onClick={handleAdd}
                                fullWidth
                            >
                                Create Template
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <Typography variant="h2" style={{ color: 'black' }} gutterBottom>
                    Campaign Results
                </Typography>

                <br />
                <DataTable arr={arr} />
            </MainCard>
        </>
    );
}
