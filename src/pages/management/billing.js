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
import {
    getCompaigns,
    getCost,
    editCost,
    getCampaignCostByName,
    getCampaignCost,
    billPaid,
    addStripeSecret,
    getStripeSecret
} from 'api/api';
import Swal from 'sweetalert2';
import img1 from '../../assets/images/myImages/phishingportallogo.png';
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
const User = () => {
    const [data, setData] = useState([]);
    const pdfExportComponent = useRef(null);
    const [totalCompaign, setTotal] = useState('');
    const [editCosts, setEditCost] = useState(false);
    const [openInvoice, setOpenInvoice] = useState(false);
    const [paymentConfg, setpaymentConfg] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState([]);
    const [name, setName] = useState('');
    const [cost, setCost] = useState({});
    const [compaignByName, setCompaignByName] = useState([]);
    const [compaignToPay, setCompaignToPay] = useState(0);

    const getFetch = () => {
        const filterDataForMonth = (data, year, month) => {
            console.log('data >>> year >>> month>>>', data,year,month)
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0);
          
            return data.filter(item => {
              const startDate = new Date(item.startDate);
          
              // Check if startDate is within the range of the first day to the last day of the specified month
              return startDate >= firstDayOfMonth && startDate <= lastDayOfMonth;
            });
          };
        getCost()
            .then((res) => {
                setCost(res.data.costs[0]);
                // console.log(res.data.costs[0]);
            })
            .catch((err) => {
                console.log(err);
            });
            getStripeSecret()
            .then((res) => {
                // setCost(res.data.costs[0]);
                setSecretKey( res?.data?.stripeSecret )
                // console.log('getStripeSecret >>> ',res?.data?.stripeSecret);
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
                          const response = res?.data
                            const currentDate = new Date();
                            const currentYear = currentDate.getFullYear();
                            const currentMonth = currentDate.getMonth() + 1;
                            // const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                            // const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                            // const filteredData = response.filter(item => {
                            // const startDate = new Date(item.startDate);
                            // return startDate >= firstDayOfLastMonth && startDate < firstDayOfCurrentMonth;
                            // });
                            // console.log('filteredData >>>',filteredData)
                            const totalCampaignsPerMonth = [];

                            const monthNames = [
                                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                                'August', 'September', 'October', 'November', 'December'
                            ];


                            // Iterate over each month
                            for (let month = 1; month < currentMonth; month++) {
                                // Use the filterDataForMonth function to filter data for the current month
                                const filteredDataForMonth = filterDataForMonth(response, currentYear, month);
                                console.log('filteredDataForMonth >>> ',filteredDataForMonth)
                                // Count the number of campaigns for the current month
                                const totalCampaignsForMonth = filteredDataForMonth.length;
                                //   console.log(response)
                                // Push the total count to the array
                                totalCampaignsPerMonth.push({
                                    year: currentYear,
                                    month: month,
                                    monthName: monthNames[month - 1],
                                    totalCampaigns: totalCampaignsForMonth,
                                    // username:response
                                });
                            }
                            console.log('totalCampaignsPerMonth >>>', totalCampaignsPerMonth);
                            // const filteredDataForCurrentMonth = filterDataForMonth(response, currentYear, currentMonth);
                            // console.log('filteredDataForCurrentMonth >>>', filteredDataForCurrentMonth);
                            setMonthlyPayment(totalCampaignsPerMonth)
                            console.log('setCompaign >>>',res.data);
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

    const handlepaymentConfg = () => {
        setpaymentConfg(false);
        // if (!cost.campaigns || !cost.agents) {
        //     Swal.fire('Invalid Data', 'Fill All Values', 'error');
        // } else {
        let obj ={stripeSecret:secretKey}
            addStripeSecret(obj)
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Secret key updated successfully!',
                        showConfirmButton: true,
                        confirmButtonColor: 'rgb(88, 173, 198)'
                    });
                    getFetch();
                })
                .catch((err) => {
                    Swal.fire('Oops', 'Something went wrong', 'error');
                });
        // }
    };

    // payment integration
    const makePayment = async()=>{
        const body = {
            amount: compaignToPay * cost?.campaigns || 0
        }
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await fetch("http://192.168.0.107:1338/create-checkout-session",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        });

        const session = await response.json();
    }

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
            <MainCard
                title="User Management"
                style={{ width: '100%', borderRadius: 0, boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)', padding: '16px' }}
            >
                {/* <Typography variant="body2" style={{ color: 'black ' }}>
            Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
            ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
            reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
            qui officiate descent molls anim id est labours.
        </Typography> */}
                <span style={{ color: '#888' }}>Cost Per Agent : ${cost?.agents || 0}</span> &nbsp;&nbsp;&nbsp;
                <span style={{ color: '#888' }}>Cost Per Compaign : ${cost?.campaigns || 0}</span>&nbsp;&nbsp;&nbsp;
                {JSON.parse(localStorage.getItem('userdata')).type !== 'SuperUser' && (
                    <>
                        <span style={{ fontWeight: 'bold', color: '#888' }}>Total Agents : {0}</span>&nbsp;&nbsp;&nbsp;
                        <span style={{ fontWeight: 'bold', color: '#888' }}>Total Compaigns : {compaignToPay || 0}</span>
                    </>
                )}
                {JSON.parse(localStorage.getItem('userdata')).type === 'SuperUser' ? (
                    <>
                        <Button
                            style={{ float: 'right', backgroundColor: '#e1f1f5', color: '#58adc6' }}
                            variant="outlined"
                            onClick={() => setEditCost(true)}
                        >
                            Edit Cost
                        </Button>
                        <Button
                            style={{ float: 'right', backgroundColor: '#e1f1f5', color: '#58adc6', marginRight: 2 }}
                            variant="outlined"
                            onClick={() => setpaymentConfg(true)}
                        >
                            Add Payment Configuration
                        </Button>
                    </>
                ) : (
                    <>
                        <form action="http://192.168.0.107:1338/create-checkout-session" method="POST">
                            <input type="hidden" name="key1" value="value1" />
                            <input type="hidden" name="key2" value="value2" />
                            <button
                                style={{ float: 'right' }}
                                className="btn btn-primary mx-2 px-sm-4 bg-brand-color-1"
                                //onClick={makePayment}
                            >
                                {' '}
                                ${compaignToPay * cost?.campaigns || 0} - Pay Now
                            </button>
                        </form>
                        <button style={{ float: 'right' }} className="btn btn-primary shadow px-sm-4" onClick={handleDownloadInvoice}>
                            ${compaignToPay * cost?.campaigns || 0} - Download Invoice
                        </button>
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
                        <Typography
                            variant="h2"
                            component="h2"
                            className="my-2 mx-auto"
                            sx={{ textAlign: 'center', color: 'var(--pc-heading-color)' }}
                        >
                            Edit Cost
                        </Typography>
                        <br />
                        <ThemeProvider theme={theme}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Cost Per Agent
                            </Typography>
                            <input
                                class="form-control"
                                placeholder="100"
                                id="CostPerAgent"
                                label="Cost Per Agent"
                                value={cost.agents}
                                onChange={(e) => setCost({ ...cost, agents: e.target.value })}
                                type="number"
                            />
                            <br />
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Cost Per Campaign
                            </Typography>
                            <input
                                class="form-control"
                                placeholder="150"
                                id="Cost Per Campaign"
                                label="Cost Per Campaign"
                                value={cost.campaigns}
                                type="number"
                                onChange={(e) => setCost({ ...cost, campaigns: e.target.value })}
                            />
                            <br />
                        </ThemeProvider>
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <button className="btn btn-primary shadow px-sm-4 mx-auto" onClick={handleEditCost}>
                                Update Cost
                            </button>
                        </div>
                    </Box>
                </Modal>
                <Modal
                    open={paymentConfg}
                    onClose={() => {
                        setpaymentConfg(false);
                    }}
                >
                    <Box sx={style}>
                        <h4>Add Payment Configuration</h4>
                        <ThemeProvider theme={theme}>
                            <TextField
                                label="Stripe Secret Key"
                                value={secretKey}
                                type="password"
                                onChange={(e) => setSecretKey(e.target.value)}
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
                            onClick={handlepaymentConfg}
                        >
                            Update Payment
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
                                            <button
                                                className="btn btn-primary px-sm-4 bg-brand-color-1"
                                                onClick={() => handlePayment(e?.total * cost?.campaigns, e?.username)}
                                            >
                                                Pay
                                            </button>
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
                                                {e?.payment == '1' ? (
                                                    <Chip label="Paid" className="bg-brand-color-1" />
                                                ) : (
                                                    <Chip label="UnPaid" className="bg-brand-color-2" />
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
                        fileName={`Portal-Invoice-${new Date().toLocaleDateString()}`}
                        //   repeatHeaders={true}
                    >
                        <div className="container  px-2  py-3 my-5" style={{ position: 'relative' }}>
                            {/* <h2>Just Testing</h2> */}
                            <img src={img1} alt="cyberops logo" width="250px" />
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
                            className="btn btn-primary shadow px-sm-4 mx-auto"
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
