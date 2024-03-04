// material-ui
import React, { useEffect } from 'react';
import { Typography, Button, Modal, Box, TextField, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';
// project import
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';
import { createUser, deleteUser, editUser, getUsers } from 'api/api';

// ==============================|| SAMPLE PAGE ||============================== //
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'rgb(36, 41, 57)',
    color: 'white !important',

    boxShadow: 24,
    p: 4,
    overflowX: 'hidden',
    overflowY: 'auto'
    // minHeight: "400px",
    // maxHeight: "600px",
};
const GoPhish = () => {
    const [open, setOpen] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');
    const [data, setData] = React.useState([]);
    const [editData, setEditData] = React.useState([]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditModal(false);
        setName('');
        setPassword('');
        setRole('');
    };
    const handleCheckClose = () => {
        setOpen(false);
    };
    const handleEdit = () => {
        setEditModal(false);
        if (name === '' || role === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                ...editData,
                username: name,
                role: role
            };
            editUser(obj, editData?.id)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User Updated successfully!',
                        showConfirmButton: true,
                        confirmButtonColor: 'rgb(88, 173, 198)',
                        timer: 1500
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
        if (name === '' || password === '' || role === '') {
            Swal.fire('Invalid Data', 'Fill all fields!', 'error');
            setOpen(true);
        } else {
            let obj = {
                username: name,
                password: password,
                role: role
            };
            createUser(obj)
                .then((res) => {
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User created successfully!',
                        showConfirmButton: true,
                        timer: 1500,
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

    const fetchUser = () => {
        getUsers()
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDeleteGroup = (i) => {
        deleteUser(i)
            .then((res) => {
                console.log(res);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User deleted successfully!',
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

    const handleEditModal = (e) => {
        setEditModal(true);
        setName(e?.username);
        // setPassword(e?.password);
        setRole(e?.role.slug);
        setEditData(e);
    };

    return (
        <MainCard title="Sample Card" style={{ width: '100%', borderRadius: 0, boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)', padding: '16px' }}>
            {/* <a href="https://127.0.0.1:3333/" target="_blank"> */}
            <Button variant="contained" onClick={handleOpen}>
                Add User
            </Button>
            {/* </a> */}
            {/* <a href="https://127.0.0.1:3333/" target="_blank">
                <Button variant="contained" className="mx-4">
                    View GoPhish
                </Button>
            </a> */}
            {/* <Typography variant="body2" className="mt-2" style={{ color: 'black ' }}>
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
                enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue
                dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president,
                sunk in culpa qui officiate descent molls anim id est labours.
            </Typography> */}
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
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            UserName
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            label="Enter UserName"
                            variant="outlined"
                            style={{ color: 'black' }}
                            color="primary"
                            size="small"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Password
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            label="Password"
                            style={{ color: 'black' }}
                            size="small"
                            type="password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Role
                        </Typography>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={role}
                            style={{ backgroundColor: 'rgb(36, 41, 57)' }}
                            label="Role"
                            size="small"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="user" style={{ color: 'black' }}>
                                User
                            </MenuItem>
                            <MenuItem value="admin" style={{ color: 'black' }}>
                                Admin
                            </MenuItem>
                        </Select>
                        {/* <Typography
              id="demo-simple-select-label"
              variant="h4"
              component="h2"
            >
              Scan
            </Typography> */}

                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#70d8bd'

                                // color: "black"
                            }}
                            onClick={handleAdd}
                            fullWidth
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <table className="table table-hover mt-4">
                <thead className="thead-dark">
                    <tr>
                        <td>ID</td>
                        <td>UserName</td>
                        <td>UserType</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 &&
                        data?.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e.id}</td>
                                    <td>{e.username}</td>
                                    <td>{e.role.name}</td>
                                    <td>
                                        <IconButton onClick={() => handleEditModal(e)}>
                                            <EditIcon color="success" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteGroup(e?.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            <Modal open={editModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '41ch' }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            UserName
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            label="Enter UserName"
                            variant="outlined"
                            style={{ color: 'black' }}
                            color="primary"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Role
                        </Typography>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={role}
                            style={{ backgroundColor: 'rgb(36, 41, 57)' }}
                            label="Role"
                            size="small"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="user" style={{ color: 'black' }}>
                                User
                            </MenuItem>
                            <MenuItem value="admin" style={{ color: 'black' }}>
                                Admin
                            </MenuItem>
                        </Select>
                        {/* <Typography
              id="demo-simple-select-label"
              variant="h4"
              component="h2"
            >
              Scan
            </Typography> */}

                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#70d8bd'

                                // color: "black"
                            }}
                            onClick={handleEdit}
                            fullWidth
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </MainCard>
    );
};

export default GoPhish;
