// project import
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import MainCard from 'components/MainCard';
import { useEffect, useRef, useState } from 'react';
import { Typography, Button, Modal, Box, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { PDFExport } from '@progress/kendo-react-pdf';
import { getCompaigns, getCost, editCost, getCampaignCostByName, getCampaignCost, billPaid } from 'api/api';
import Swal from 'sweetalert2';
import img1 from '../../assets/images/myImages/1.PNG';
import img2 from '../../assets/images/myImages/2.PNG';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

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
        color: theme.palette.common.black
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
    maxHeight: '600px',
    boxShadow: 24,
    p: 4,
    overflowX: 'auto',
    overflowY: 'auto'
    // minHeight: "400px",
    // maxHeight: "600px",
};
const User = () => {
    const [data, setData] = useState([]);
    const pdfExportComponent = useRef(null);
    const [totalCompaign, setTotal] = useState('');
    const [editCosts, setEditCost] = useState(false);
    const [openInvoice, setOpenInvoice] = useState(false);
    const [name, setName] = useState('');
    const [cost, setCost] = useState({});
    const [compaignByName, setCompaignByName] = useState([]);
    const [compaignToPay, setCompaignToPay] = useState(0);

    const getFetch = () => {
        getCost()
            .then((res) => {
                setCost(res.data.costs[0]);
                console.log(res.data.costs[0]);
            })
            .catch((err) => {
                console.log(err);
            });
        {
            JSON.parse(localStorage.getItem('userdata')).type === 'SuperUser'
                ? getCampaignCostByName()
                      .then((res) => {
                          setCompaignByName(res.data);
                          console.log(res.data);
                      })
                      .catch((err) => {
                          console.log(err);
                      })
                : getCampaignCost(JSON.parse(localStorage.getItem('userdata'))?.username?.name)
                      .then((res) => {
                          setCompaignByName(res.data);
                          console.log(res.data);
                          const data = res?.data?.filter((e) => e.payment !== '1');
                          setCompaignToPay(data?.length);
                      })
                      .catch((err) => {
                          console.log(err);
                      });
        }
    };
    const getCompaign = () => {
        getCompaigns()
            .then((res) => {
                setData(res.data);
                setTotal(res.data.length);
                console.log('Compaign', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getCompaign();
        getFetch();
        // axios
        //     .get('http://192.168.1.99:1338/getUser')
        //     .then((res) => {
        //         // setData(res.data.users);
        //         // console.log(userData);
        //         console.log(res.data.users);
        //         const user = JSON.parse(localStorage.getItem('userdata'));
        //         console.log(user);
        //         setName(user.username);
        //         const result = res.data.users?.filter((e) => e.name === user.username);
        //         // setData(result)
        //         console.log(result);
        //         // axios
        //         //     .get(`http://192.168.1.99:1338/getCompaign/${JSON.parse(localStorage.getItem('userdata'))?.gophishkey}`, {
        //         //         gophishapikey: JSON.parse(localStorage.getItem('userdata'))?.gophishkey
        //         //     })

        //     })
        //     .catch((err) => {
        //         window.alert('Something went wrong');
        //     });
        // setData(JSON.parse(localStorage.getItem('userdata')));
        // console.log(JSON.parse(localStorage.getItem('Users')));
    }, []);

    const handleEditCost = () => {
        setEditCost(false);
        if (!cost.campaigns || !cost.agents) {
            Swal.fire('Invalid Data', 'Fill All Values', 'error');
        } else {
            editCost(cost)
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Cost updated successfully!',
                        showConfirmButton: true,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    getFetch();
                })
                .catch((err) => {
                    Swal.fire('Oops', 'Something went wrong', 'error');
                });
        }
    };

    const handleDownloadInvoice = () => {
        setOpenInvoice(true);
    };

    const handleDownloadPDF = () => {
        // setOpenInvoice(true);/
        console.log('Download PDF');
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
            // setDownload(false);
        }
    };

    const handlePayment = (bill, username) => {
        const obj = {
            username,
            bill
        };

        Swal.fire({
            title: 'Are you sure?',
            text: 'Mark the payment?. You will not be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: 'rgb(88, 173, 198)'

            // buttons: ['No, cancel it!', 'Yes, I am sure!'],
            // dangerMode: true
        }).then(function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm.isConfirmed) {
                billPaid(obj)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Payment Updated Successfully!',
                            showConfirmButton: true,
                            confirmButtonColor: 'rgb(88, 173, 198)'
                        });
                        getCompaign();
                        getFetch();
                    })
                    .catch((err) => {
                        Swal.fire('Failed', 'Could Not Update', 'error');
                    });
            }
        });
    };

    return (
        <>
            <MainCard title="User Management">
                {/* <Typography variant="body2" style={{ color: 'black ' }}>
            Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
            ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
            reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
            qui officiate descent molls anim id est labours.
        </Typography> */}
                <span>Cost Per Agent : ${cost?.agents || 0}</span> &nbsp;&nbsp;&nbsp;
                <span>Cost Per Compaign : ${cost?.campaigns || 0}</span>&nbsp;&nbsp;&nbsp;
                {JSON.parse(localStorage.getItem('userdata')).type !== 'SuperUser' && (
                    <>
                        <span style={{ fontWeight: 'bold' }}>Total Agents : {0}</span>&nbsp;&nbsp;&nbsp;
                        <span style={{ fontWeight: 'bold' }}>Total Compaigns : {compaignToPay || 0}</span>
                    </>
                )}
                {JSON.parse(localStorage.getItem('userdata')).type === 'SuperUser' ? (
                    <Button
                        style={{ float: 'right', backgroundColor: '#e1f1f5', color: '#58adc6' }}
                        variant="outlined"
                        onClick={() => setEditCost(true)}
                    >
                        Edit Cost
                    </Button>
                ) : (
                    <>
                        <Button
                            style={{ float: 'right', fontWeight: 'bold', backgroundColor: '#58adc6', color: '#e1f1f5' }}
                            variant="outlined"
                            onClick={handleDownloadInvoice}
                        >
                            ${compaignToPay * cost?.campaigns || 0} - Download Invoice
                        </Button>
                        {/* &nbsp;&nbsp;{' '}
                        <span style={{ float: 'right', fontWeight: 'bold' }}>
                            Total Bill : ${compaignToPay * cost?.campaigns || 0}
                        </span> */}
                    </>
                )}
                <Modal
                    open={editCosts}
                    onClose={() => {
                        setEditCost(false);
                    }}
                >
                    <Box sx={style}>
                        <h4>Edit Cost</h4>
                        <ThemeProvider theme={theme}>
                            <TextField
                                label="Cost Per Agent"
                                value={cost.agents}
                                onChange={(e) => setCost({ ...cost, agents: e.target.value })}
                                type="number"
                                fullWidth
                                inputProps={{ style: { color: 'white' } }}
                                className="my-2"
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                            />
                            <br />
                            <TextField
                                label="Cost Per Compaign"
                                value={cost.campaigns}
                                type="number"
                                onChange={(e) => setCost({ ...cost, campaigns: e.target.value })}
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                inputProps={{ style: { color: 'white' } }}
                                className="my-2"
                                size="small"
                            />
                            <br />
                        </ThemeProvider>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#58adc6', color: '#e1f1f5' }}
                            fullWidth
                            onClick={handleEditCost}
                        >
                            Update Cost
                        </Button>
                    </Box>
                </Modal>
                <br />
                <br />
                <br />
                {JSON.parse(localStorage.getItem('userdata')).type === 'SuperUser' ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S.No</StyledTableCell>
                                    <StyledTableCell align="left">User Name</StyledTableCell>
                                    <StyledTableCell align="left">Total Agent</StyledTableCell>
                                    <StyledTableCell align="left">Total Campaign</StyledTableCell>
                                    <StyledTableCell align="left">Total Cost</StyledTableCell>
                                    <StyledTableCell align="left">Payment</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {compaignByName?.map((e, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell component="th" scope="row">
                                            {i + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{e?.username}</StyledTableCell>
                                        <StyledTableCell align="left">{0}</StyledTableCell>
                                        <StyledTableCell align="left">{e?.total}</StyledTableCell>
                                        <StyledTableCell align="left">${e?.total * cost?.campaigns}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button
                                                color="success"
                                                variant="contained"
                                                style={{ fontWeight: 'bold' }}
                                                onClick={() => handlePayment(e?.total * cost?.campaigns, e?.username)}
                                            >
                                                Pay
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>S.No</StyledTableCell>
                                        <StyledTableCell align="left">User Name</StyledTableCell>
                                        <StyledTableCell align="left">AgentId</StyledTableCell>
                                        <StyledTableCell align="left">CampaignId</StyledTableCell>
                                        <StyledTableCell align="left">StartDate</StyledTableCell>
                                        <StyledTableCell align="left">Payment</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {compaignByName?.map((e, i) => (
                                        <StyledTableRow key={i}>
                                            <StyledTableCell component="th" scope="row">
                                                {i + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{e?.username}</StyledTableCell>
                                            <StyledTableCell align="left">{0}</StyledTableCell>
                                            <StyledTableCell align="left">{e?.campaignId}</StyledTableCell>
                                            <StyledTableCell align="left">{e?.startDate}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                {e?.payment === '1' ? (
                                                    <Chip label="Paid" color="success" />
                                                ) : (
                                                    <Chip label="UnPaid" color="error" />
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                <br />
                {compaignByName.length <= 0 && <h5 style={{ textAlign: 'center' }}>Fetching Data ...</h5>}
            </MainCard>
            <Modal
                open={openInvoice}
                onClose={() => {
                    setOpenInvoice(false);
                }}
            >
                <Box
                    sx={{ ...style, bgcolor: 'white', color: 'black !important', width: '90%', maxHeight: '90%', border: '1px solid grey' }}
                >
                    <PDFExport
                        //   keepTogether=".page-break"
                        ref={pdfExportComponent}
                        paperSize="A3"
                        fileName={`CyberOpsBox-Invoice-${new Date().toLocaleDateString()}`}
                        //   repeatHeaders={true}
                    >
                        <div className="container  px-2  py-3 my-5" style={{ position: 'relative' }}>
                            {/* <h2>Just Testing</h2> */}
                            <img src={img1} alt="cyberops logo" width="100%" />
                            <div className="container d-flex justify-content-between">
                                <img src={img2} alt="cyberops logo" width="30%" />
                                <div style={{ marginRight: '15%', float: 'left', marginTop: '6%' }}>
                                    <span style={{ textAlign: 'right' }}>
                                        <strong>INVOICE #</strong> 12345
                                    </span>
                                    <br />
                                    <span>
                                        <b style={{ textAlign: 'right' }}>DATE </b>&nbsp; {new Date().toLocaleDateString()}
                                    </span>
                                    <br />
                                    <span>
                                        <b style={{ textAlign: 'right' }}>DUE DATE</b>&nbsp;&nbsp;{' '}
                                        {new Date().getMonth() + 1 + '/' + (new Date().getDate() + 1) + '/' + new Date().getFullYear()}
                                    </span>
                                    <br />
                                    <span>
                                        <b style={{ textAlign: 'right' }}>TERMS </b>&nbsp; Net 30
                                    </span>
                                </div>
                            </div>
                            <div className="container">
                                <hr style={{ backgroundColor: '#58adc6' }} />
                            </div>
                            {/* <br /> */}
                            <div className="container d-flex justify-content-between">
                                <div>
                                    <h6 style={{ fontWeight: 'bold' }}>PAYMENT METHOD</h6>
                                    <p>Credit Card</p>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <div className="pe-3">
                                        <h6 style={{ fontWeight: 'bold' }}>CUSTOMER NAME</h6>
                                        <p>{JSON.parse(localStorage.getItem('userdata'))?.username?.name}</p>
                                    </div>
                                    <div className="pe-3">
                                        <h6 style={{ fontWeight: 'bold' }}>ADDRESS</h6>
                                        <p>{JSON.parse(localStorage.getItem('userdata'))?.username?.address || 'Not Available'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <table className="table  mt-4">
                                    <thead style={{ backgroundColor: '#e1f1f5', color: '#58adc6' }}>
                                        <tr>
                                            <td></td>
                                            <td>QTY </td>
                                            {/* <td>Start Date</td>
                            <td>Last Paid Date</td>
                            <td>Total Agents</td> */}
                                            <td>Rate</td>
                                            <td>Amount</td>
                                            {/* <td>StartDate</td> */}

                                            {/* <td>Total Cost (Last 30 Days)</td> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Total Compaigns</td>
                                            <td>{compaignToPay || 0}</td>
                                            <td>{cost?.campaigns}</td>
                                            <td>{compaignToPay * cost?.campaigns}</td>
                                            {/* <td>{e?.startDate}</td> */}

                                            {/* <td>${e?.total * cost.campaigns}</td> */}
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Total Agents</td>
                                            <td>{0}</td>
                                            <td>{cost?.agents}</td>
                                            <td>{0 * cost?.agents}</td>
                                            {/* <td>{e?.startDate}</td> */}

                                            {/* <td>${e?.total * cost.campaigns}</td> */}
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}></td>
                                            <td></td>
                                            <td style={{ fontWeight: 'bold' }}>TOTAL</td>
                                            <td style={{ fontWeight: 'bold' }}>$ {0 * cost?.agents + compaignToPay * cost?.campaigns}</td>
                                            {/* <td>{e?.startDate}</td> */}

                                            {/* <td>${e?.total * cost.campaigns}</td> */}
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}></td>
                                            <td></td>
                                            <td style={{ fontWeight: 'bold' }}>BALANCE DUE</td>
                                            <td style={{ fontWeight: 'bold' }}>$ {0 * cost?.agents + compaignToPay * cost?.campaigns}</td>
                                            {/* <td>{e?.startDate}</td> */}

                                            {/* <td>${e?.total * cost.campaigns}</td> */}
                                        </tr>

                                        {/* {data?.length > 0 &&
                            data?.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{JSON.parse(localStorage.getItem('userdata'))?.username}</td>

                                        <td>{data?.length}</td>
                                        <td>{data?.length * 15}$</td> 
                                    </tr>
                                );
                            })}*/}
                                    </tbody>
                                </table>
                            </div>
                            <br />
                            <div className="container">
                                <p style={{ textAlign: 'center' }}>This is Computer Generated Report</p>
                            </div>
                        </div>
                    </PDFExport>
                    <div className="container px-2">
                        <Button
                            variant="contained"
                            fullWidth
                            style={{ textAlign: 'center', backgroundColor: '#58adc6' }}
                            onClick={handleDownloadPDF}
                        >
                            Download
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};
export default User;
