import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

export default function FullScreenDialog({ showReport, onClose, clientData, clientEmail, data, report, ioc, cves, affectedProduct }) {
    const [open, setOpen] = React.useState(true);
    const [impact, setImpact] = React.useState(true);
    const [affected_products, setAffectedProducts] = React.useState(true);
    const [ip, setip] = React.useState(true);

    React.useEffect(() => {
        setImpact(report?.[0]?.impact.split(','));
        setAffectedProducts(affectedProduct?.[0]?.product.split(','));
        setip();
    }, []);

    return (
        <div>
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}

            <Dialog fullScreen open={showReport} onClose={onClose}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
                            {report?.[0]?.title}
                            <Typography sx={{ flex: 1 }} variant="h6" component="div">
                                {report?.[0]?.subtitle}
                            </Typography>
                        </Typography>

                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}
                    </Toolbar>
                </AppBar>
                <div className="container my-5 px-5 rounded" style={{ backgroundColor: 'whitesmoke', maxWidth: '700px' }}>
                    <Typography
                        sx={{ ml: 2, flex: 1, mt: 3 }}
                        style={{ fontWeight: 'bold', fontFamily: 'Roboto' }}
                        variant="h1"
                        component="div"
                        className="text-center"
                        color={report?.[0]?.reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        {report?.[0]?.reportingType}
                    </Typography>
                    <hr className="border border-secondary border-2 opacity-50" />
                    <Typography
                        sx={{ flex: 1, mt: 3 }}
                        variant="h3"
                        component="div"
                        style={{ backgroundColor: '#0875b8', textAlign: 'center', color: 'white' }}
                        // color={report?.[0].reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        Analysis Summary :
                    </Typography>
                    <Typography sx={{ ml: 2, flex: 1, mt: 2, mr: 2 }} style={{ textAlign: 'justify' }} variant="h6" component="div">
                        {report?.[0]?.summary}
                    </Typography>

                    <Typography
                        sx={{ flex: 1, mt: 3 }}
                        variant="h3"
                        component="div"
                        style={{ backgroundColor: '#0875b8', textAlign: 'center', color: 'white' }}
                        // color={report?.[0].reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        Impact :
                    </Typography>
                    {report?.[0]?.impact?.split(',').map((e, i) => (
                        <li className="ms-3 mt-2">{e}</li>
                    ))}

                    <Typography
                        sx={{ flex: 1, mt: 3 }}
                        variant="h3"
                        style={{ backgroundColor: '#0875b8', textAlign: 'center', color: 'white' }}
                        component="div"
                        // color={report?.[0].reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        Affected Products(s) :
                    </Typography>
                    {affectedProduct?.[0]?.product?.split(',').map((e, i) => (
                        <li className="ms-3 mt-2">{e}</li>
                    ))}

                    <Typography
                        sx={{ flex: 1, mt: 3 }}
                        variant="h3"
                        style={{ backgroundColor: '#0875b8', textAlign: 'center', color: 'white' }}
                        component="div"
                        // color={report?.[0].reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        {ioc?.length > 0 ? 'IOCs : ' : 'CVEs & INFO : '}
                    </Typography>
                    {ioc?.length > 0 &&
                        ioc?.map((e, i) => (
                            <>
                                <Typography sx={{ ml: 2, flex: 1, mt: 2 }} variant="h5" component="div">
                                    {e?.ioc_type}
                                </Typography>{' '}
                                {e?.ioc?.split(',').map((e, i) => (
                                    <li className="ms-3 mt-2">{e}</li>
                                ))}
                            </>
                        ))}
                    {cves?.length > 0 && (
                        <div>
                            <table className="table table-bordered mt-3 ">
                                <tbody>
                                    <tr
                                        style={{
                                            backgroundColor: '#0875b8',
                                            color: 'white'
                                        }}
                                    >
                                        <td
                                            style={{
                                                textAlign: 'left',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                width: '150px'
                                            }}
                                        >
                                            CVE Number(s)
                                        </td>
                                        <td
                                            style={{
                                                textAlign: 'left',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                width: '200px'
                                            }}
                                        >
                                            Description
                                        </td>
                                        <td
                                            style={{
                                                textAlign: 'left',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Published
                                        </td>
                                        <td
                                            style={{
                                                textAlign: 'left',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            CVSS Score
                                        </td>
                                    </tr>

                                    {cves?.map((e, i) => (
                                        <tr key={i}>
                                            <td
                                                style={{
                                                    textAlign: 'left',
                                                    verticalAlign: 'center',
                                                    fontSize: '13px',
                                                    fontWeight: 'bolder',
                                                    width: '150px'
                                                }}
                                            >
                                                {e.cve_name}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'justify',
                                                    verticalAlign: 'center',
                                                    fontSize: '12px',
                                                    width: '200px'
                                                }}
                                            >
                                                {e.cve_description}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    verticalAlign: 'center',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {e.published_date.slice(0, 10)}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    verticalAlign: 'center',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {e.cvss_score}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Typography
                        sx={{ flex: 1, mt: 3 }}
                        variant="h3"
                        component="div"
                        style={{ backgroundColor: '#0875b8', textAlign: 'center', color: 'white' }}
                        // color={report?.[0].reportingType === 'Alert' ? 'error' : 'primary'}
                    >
                        Remediation :
                    </Typography>
                    {report?.[0]?.remediation?.split(',').map((e, i) => (
                        <li className="ms-3 mt-2 mb-3">{e}</li>
                    ))}
                </div>
                {/* <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                </List> */}
            </Dialog>
        </div>
    );
}
