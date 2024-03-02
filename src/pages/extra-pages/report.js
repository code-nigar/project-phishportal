import { useState } from 'react';

// material-ui
import { Grid, Typography, Button, Stack, Box } from '@mui/material';
import { Doughnut, ArcElement, Tooltip, Title } from 'react-chartjs-2';
// project import
import OrdersTable from '../dashboard/OrdersTable';
// import MainCard from 'components/MainCard';
// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { useEffect } from 'react';
import { WazuhIntegration } from '../../api/api';
import MainCard from '../../components/MainCard';
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';
import { PieChart } from 'react-minimal-pie-chart';
import ReactApexChart from 'react-apexcharts';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
import OrderTable from '../dashboard/OrdersTable';
import Chart from 'react-apexcharts';

//card
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const series = [44, 55, 41, 17, 15];
const options = {
    plotOptions: {
        pie: {
            customScale: 0.9
        }
    },
    chart: {
        type: 'donut'
    },
    responsive: [
        {
            breakpoint: 300,
            options: {
                chart: {
                    width: 100
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    ],
    labels: ['Active', 'Disconnected', 'Never Connected'],
    colors: ['#1890ff', '#EE280E', '#CF7D00']
};
const osOptions = {
    chart: {
        type: 'bar'
    },
    plotOptions: {
        bar: {
            distributed: true
        }
    },
    series: [
        {
            data: [
                {
                    x: 'category A',
                    y: 10
                },
                {
                    x: 'category B',
                    y: 18
                },
                {
                    x: 'category C',
                    y: 13
                }
            ]
        }
    ]
};

const Report = () => {
    const [wazuhData, setWazuhData] = useState([]);
    const [activewazuhData, setActiveWazuhData] = useState([]);
    const [disconnectedwazuhData, setDisconnectedWazuhData] = useState([]);
    const [neverconnectedwazuhData, setNeverconnectedWazuhData] = useState([]);
    const [open, setOpen] = useState(false);
    const [series, setSeries] = useState([]);
    const [windows, setWindows] = useState([]);
    const [linux, setLinux] = useState([]);
    const [body, setBody] = useState([]);
    const [slot, setSlot] = useState('week');
    const [pieChart, setPieChart] = useState(false);
    const [barChart, setBarChart] = useState(false);

    useEffect(() => {
        setOpen(true);
        console.log(JSON.parse(localStorage.getItem('userdata')));
        // const data=
        setBody(JSON.parse(localStorage.getItem('userdata')));
    }, []);
    useEffect(() => {
        if (body?.body?.length > 0) {
            console.log(body?.body);
            setWazuhData(body?.body);
            setActiveWazuhData(body?.body?.filter((e) => e.status === 'active'));
            setDisconnectedWazuhData(body?.body?.filter((e) => e.status === 'disconnected'));
            setNeverconnectedWazuhData(body?.body?.filter((e) => e.status === 'neverconnected'));
            setWindows(body?.body?.filter((e) => e.os.platform === 'windows'));
            setLinux(body?.body?.filter((e) => e.os.platform === 'ubuntu'));
            setOpen(false);
        }
    }, [body]);
    useEffect(() => {
        setPieChart(true);
        console.log(activewazuhData);
    }, [disconnectedwazuhData]);

    useEffect(() => {
        console.log(windows);
        setBarChart(true);
    }, [windows]);

    const handleWazuhOpen = () => {
        window.open('https://172.168.10.71/');
    };
    return (
        <>
            <MainCard title="SIEM" style={{ color: 'black ' }}>
                <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                    {/* row 1 */}
                    <Grid item xs={6} sm={3} md={2} lg={5.5}>
                        <Grid item>
                            <Typography variant="h5">Assets Summary</Typography>
                        </Grid>
                        {pieChart && (
                            <Card sx={{ maxWidth: 675 }}>
                                <CardActionArea>
                                    <CardContent>
                                        <div id="chart">
                                            {/* <ReactApexChart
                                                options={options}
                                                series={[
                                                    activewazuhData?.length,
                                                    disconnectedwazuhData?.length,
                                                    neverconnectedwazuhData?.length
                                                ]}
                                                type="donut"
                                            /> */}
                                            <Doughnut
                                                data={{
                                                    labels: ['Connected', 'Disconnected', 'Never Connected'],
                                                    datasets: [
                                                        {
                                                            label: '# of votes',
                                                            data: [
                                                                activewazuhData?.length,
                                                                disconnectedwazuhData?.length,
                                                                neverconnectedwazuhData?.length
                                                            ],
                                                            backgroundColor: ['#1890ff', '#EE280E', '#CF7D00'],

                                                            borderWidth: 1
                                                        }
                                                    ]
                                                }}
                                                height={242}
                                                width={300}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        yAxes: [
                                                            {
                                                                ticks: {
                                                                    beginAtZero: true
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    legend: {
                                                        labels: {
                                                            fontSize: 10
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        <Typography style={{ color: 'black' }} className="mt-2" variant="h5">
                                            Total Assets : {wazuhData?.length}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )}
                    </Grid>
                    <Grid item xs={7} lg={6.5} sm={3} md={2}>
                        <Grid item>
                            <Typography variant="h5">Operating System Of Assets </Typography>
                        </Grid>
                        {barChart && (
                            <Card sx={{ maxWidth: 675 }}>
                                <CardActionArea>
                                    <CardContent>
                                        <div id="chart" style={{ marginTop: '20px', color: 'black' }}>
                                            <Chart
                                                type="bar"
                                                width={480}
                                                height={240}
                                                series={[
                                                    {
                                                        name: 'OS',
                                                        data: [
                                                            windows?.length,
                                                            linux?.length,
                                                            body?.body?.length - windows?.length - linux?.length
                                                        ]
                                                    }
                                                ]}
                                                options={{
                                                    // title: {
                                                    //     text: 'BarChar Developed by DevOps Team',
                                                    //     style: { fontSize: 30 }
                                                    // },

                                                    // subtitle: {
                                                    //     text: 'This is BarChart Graph',
                                                    //     style: { fontSize: 18 }
                                                    // },

                                                    colors: ['rgb(24, 144, 255)'],
                                                    theme: { mode: 'light' },

                                                    xaxis: {
                                                        tickPlacement: 'on',
                                                        categories: ['Windows', 'Linux', 'Others']
                                                    },

                                                    yaxis: {
                                                        labels: {
                                                            formatter: (val) => {
                                                                return `${val}`;
                                                            },
                                                            style: { fontSize: '16', colors: ['rgb(24, 144, 255)'] }
                                                        }
                                                    }

                                                    // legend: {
                                                    //     show: true,
                                                    //     position: 'right'
                                                    // },

                                                    // dataLabels: {
                                                    //     formatter: (val) => {
                                                    //         return `${val}`;
                                                    //     },
                                                    //     style: {
                                                    //         colors: ['#f4f4f4'],
                                                    //         fontSize: 15
                                                    //     }
                                                    // }
                                                }}
                                            ></Chart>
                                        </div>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard style={{ color: 'black', marginTop: '20px' }}>
                <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                    <Grid item>
                        <Typography variant="h5">Most Triggered Rule</Typography>
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard style={{ color: 'black', marginTop: '20px' }}>
                <Grid item>
                    <Typography variant="h5">Latest Integrations</Typography>
                </Grid>
                <OrderTable reports={body && body.body} />
            </MainCard>
            <Button variant="outlined" className="mt-3 ms-4" color="primary" onClick={handleWazuhOpen}>
                Open Wazuh
            </Button>
        </>
    );
};

export default Report;
