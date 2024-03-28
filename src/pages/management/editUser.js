import { useEffect, useState } from 'react';
import { Typography, Button, Box, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { Modal, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import { updatePortalUser } from 'api/api';
import '../extra-pages/custom.css';
import * as React from 'react';
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
const stringToBoolean = (str) => str === 'true';

const EditUser = ({ editModal, handleEditModal, UserDetails }) => {
    const [modal2, setModal2] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [wazuhChecked, setWazuhChecked] = useState(false);
    const [gophishChecked, setGophishChecked] = useState(false);
    const [gophishapikey, setGophishAPikey] = useState('');
    const [gophishId, setGophishId] = useState('');

    useEffect(() => {
        if (UserDetails) {
            //console.log(UserDetails);
            const { name, address, username, wazuh, gophish, gophishapikey, gophishId } = UserDetails;
            setName(name);
            setAddress(address);
            setEmail(username);
            setWazuhChecked(stringToBoolean(wazuh));
            setAddress(address);
            setGophishChecked(stringToBoolean(gophish));
            setGophishId(gophishId);
            setGophishAPikey(gophishapikey);
            setModal2(editModal);
        }
    }, [UserDetails, editModal]);

    const handleNameEdit = (event) => {
        setName(event.target.value);
    };
    const handleAddressEdit = (event) => {
        setAddress(event.target.value);
    };
    const handleWazuhChange = (event) => {
        setWazuhChecked(event.target.checked);
    };
    const handleGophishChange = (event) => {
        setGophishChecked(event.target.checked);
    };
    const handlegophishapikeyChange = (event) => {
        setGophishAPikey(event.target.value);
    };
    const handlegophishid = (event) => {
        setGophishId(event.target.value);
    };

    const handleUpdateUser = () => {
        if (
            !name ||
            !address
            // || (!wazuhChecked && !gophishChecked)
        ) {
            Swal.fire('Failed', 'Fill All the Details', 'error');
        } else {
            //console.log("output\n", {name, address, email, gophishChecked, gophishapikey, gophishId })
            const user = { name, address, email, gophishChecked, gophishapikey, gophishId };
            updatePortalUser(user)
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User Created successfully!',
                        showConfirmButton: true,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    handleEditModal();
                })
                .catch((error) => {
                    Swal.fire('Oops', error.response.data.message, 'error');
                });
        }
    };
    return (
        <>
            <Modal open={modal2} onClose={handleEditModal}>
                <div
                    style={{
                        height: '600px',
                        backgroundColor: '#f0f0f0',
                        color: '#888'
                    }}
                    className="modal-container"
                >
                    <ThemeProvider theme={theme}>
                        <Typography
                            variant="h4"
                            component="h4"
                            className="my-2 mx-auto"
                            sx={{ textAlign: 'center', color: 'var(--pc-heading-color)' }}
                        >
                            Edit User
                        </Typography>
                        <br />
                        <TextField
                            sx={{ border: '1px solid #888', color: '#888', borderRadius: '4px', lineHeight: '1.5', fontWeight: '400' }}
                            label="Name"
                            value={name}
                            inputProps={{ style: { color: '#888' } }}
                            onChange={handleNameEdit}
                            fullWidth
                            size="small"
                        />
                        <br />
                        <TextField
                            sx={{ border: '1px solid #888', color: '#888', borderRadius: '4px', lineHeight: '1.5', fontWeight: '400' }}
                            label="Address"
                            value={address}
                            inputProps={{ style: { color: '#888' } }}
                            onChange={handleAddressEdit}
                            fullWidth
                            size="small"
                        />
                        <br />

                        <Typography variant="h6" component="h4" className="my-2">
                            Select Services
                        </Typography>
                        <div>
                            {/* <Checkbox checked={wazuhChecked} onChange={handleWazuhChange} name="wazuh" style={{ color: '#888' }} />
                            SIEM */}
                            <Checkbox checked={gophishChecked} onChange={handleGophishChange} name="gophish" style={{ color: '#888' }} />
                            Phishing
                        </div>
                    </ThemeProvider>
                    <br />
                    {gophishChecked && (
                        <>
                            <TextField
                                className="mb-3"
                                label="Gophish API Key"
                                value={gophishapikey}
                                inputProps={{ style: { color: '#888', maxHeight: '100px' } }}
                                onChange={handlegophishapikeyChange}
                                style={{ marginTop: '15px' }}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                            />
                            <br />

                            <TextField
                                className="mb-3"
                                label="gophish ID"
                                value={gophishId}
                                inputProps={{ style: { color: '#888' } }}
                                onChange={handlegophishid}
                                style={{ marginBottom: '15px' }}
                                fullWidth
                                size="small"
                            />
                        </>
                    )}

                    <button className="btn btn-primary shadow px-sm-4 mx-auto" onClick={handleUpdateUser}>
                        Update User
                    </button>
                </div>
            </Modal>

            <style jsx>{`
                .modal-container {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    justify-content: center;
                    background-color: #000;
                    padding: 20px;
                    width: 500px;
                    height: 300px;
                    margin: 20px auto;
                    outline: none;
                }
            `}</style>
        </>
    );
};
export default EditUser;
