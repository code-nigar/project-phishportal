import * as React from 'react';
import { Fragment } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import { Typography, Modal, Box, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { getAllCompaignResult, getCompaignResult } from 'api/api';

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    color: 'black',
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none'
                    }
                    // Set text color to black for the entire DataGrid
                }
            }
        }
    }
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'rgb(36, 41, 57)',
    color: 'white !important',

    boxShadow: 24,
    p: 4,
    overflowX: 'auto',
    overflowY: 'auto',
    // minHeight: "400px",
    maxHeight: '600px'
};

export default function DataTable({ arr }) {
    const [openPanelId, setOpenPanelId] = React.useState(null);
    const [newModal, setNewModal] = React.useState(false);
    const [id, setId] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const handleRowClick = (params, event) => {
        setOpenPanelId(openPanelId === params.id ? null : params.id);
    };
    React.useEffect(() => {
        console.log('test');
    }, []);
    console.log(arr);
    // arr.length > 0 && setRows(arr);
    // React.useEffect(() => {
    //     setRows([]);
    //     arr?.forEach((e) => {
    //         rows.push({ id: e.id, name: e.name, status: e.status });
    //     });
    //     setRows([...rows]);
    // }, [, arr]);
    // const rows=[]

    const columns = [
        { field: 'id', headerName: 'Campaign ID', width: 120 },
        { field: 'name', headerName: 'Campaign Name', width: 130 },
        { field: 'status', headerName: 'Campaign Status', width: 130 },
        { field: 'email', headerName: 'Email', width: 170 },
        { field: 'firstname', headerName: 'First Name', width: 130 },
        { field: 'lastname', headerName: 'Last Name', width: 130 },
        // { field: 'lastName3', headerName: 'Position', width: 130 },
        { field: 'victimstatus', headerName: 'Victim Status', width: 130 },
        {
            field: 'actions',
            flex: 0.3,
            headerName: 'More',
            width: 50,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button
                            onClick={() => {
                                setNewModal(true);
                                setId(params.id);
                            }}
                        >
                            <VisibilityIcon />
                        </Button>
                    </Fragment>
                );
            }
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <div style={{ height: 500, width: '100%', backgroundColor: '#EDEEF1' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    style={{ border: 'none' }}
                />
            </div>

            <Modal
                open={newModal}
                onClose={() => {
                    setNewModal(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4">Results For CampaignName - ID</Typography>
                    <table className="table table-hover " style={{ color: 'white' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Position</th>
                                <th>UserName</th>
                                <th>Password</th>
                                <th>IP</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Position</th>
                                <th>UserName</th>
                                <th>Password</th>
                                <th>IP</th>
                                <th>Details</th>
                            </tr>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Position</th>
                                <th>UserName</th>
                                <th>Password</th>
                                <th>IP</th>
                                <th>Details</th>
                            </tr>
                        </tbody>
                    </table>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
