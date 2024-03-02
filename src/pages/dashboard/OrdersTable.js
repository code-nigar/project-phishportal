import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// third-party
import NumberFormat from 'react-number-format';
import VisibilityIcon from '@mui/icons-material/Visibility';
// project import
import Dot from 'components/@extended/Dot';
import { Grid } from '@mui/material';
import FullScreenDialog from './Dialog';
import { useEffect } from 'react';

function createData(trackingNo, name, fat, carbs, protein) {
    return { trackingNo, name, fat, carbs, protein };
}

const rows = [
    createData(84564564, 'Camera Lens', 40, 2, 40570),
    createData(98764564, 'Laptop', 300, 0, 180139),
    createData(98756325, 'Mobile', 355, 1, 90989),
    createData(98652366, 'Handset', 50, 1, 10239),
    createData(13286564, 'Computer Accessories', 100, 1, 83348),
    createData(86739658, 'TV', 99, 0, 410780),
    createData(13256498, 'Keyboard', 125, 2, 70999),
    createData(98753263, 'Mouse', 89, 2, 10570),
    createData(98753275, 'Desktop', 185, 1, 98063),
    createData(98753291, 'Chair', 100, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'fat',
        align: 'left',
        disablePadding: false,
        label: 'IP'
    },
    {
        id: 'carbs',
        align: 'left',
        disablePadding: false,

        label: 'Creation Date'
    },
    {
        id: 'protein',
        align: 'left',
        disablePadding: false,
        label: 'OS'
    },
    {
        id: 'protein',
        align: 'left',
        disablePadding: false,
        label: 'Last Responded'
    },
    {
        id: 'protein',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        style={{ color: 'black' }}
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'warning';
            title = 'Pending';
            break;
        case 1:
            color = 'success';
            title = 'Approved';
            break;
        case 2:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable({ reports }) {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);
    const [newData, setNewData] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [clientEmail, setClientEmail] = useState([]);
    const [data, setData] = useState([]);
    const [report, setReport] = useState([]);
    const [ioc, setIoc] = useState([]);
    const [cves, setCves] = useState([]);
    const [affectedProduct, setAffectedProduct] = useState([]);
    const [changeNewData, setChangeNewData] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [reportId, setReportId] = useState(0);
    const search = { outline: 'none', boxShadow: 'none' };
    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    // reports?.splice(0, 1);

    const handleSearch = (event) => {
        const searched = event.target.value.toLowerCase().replace(/[^a-zA-Z0-9;., ]/g, '');
        const data = reports?.filter(
            (e) =>
                e.name?.toLowerCase().search(searched) !== -1 ||
                e.os?.name?.toLowerCase().search(searched) !== -1 ||
                e.lastKeepAlive?.toLowerCase().search(searched) !== -1 ||
                e.status?.toLowerCase().search(searched) !== -1 ||
                e.ip?.toString().toLowerCase().search(searched) !== -1 ||
                e.dateAdd?.toString()?.toLowerCase().search(searched) !== -1
        );

        setNewData(data);
        setChangeNewData(true);
    };
    console.log(reports);
    const closeDialog = () => {
        setShowReport(false);
    };
    console.log(reports);
    return (
        <>
            {!showReport && (
                <>
                    <Grid item xs={12} className="mx-3">
                        <div className="input-group mb-3 mt-3">
                            <input
                                style={search}
                                type="text"
                                className="form-control"
                                placeholder="Search Here"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                onChange={handleSearch}
                            />
                        </div>
                    </Grid>
                    <Box>
                        <TableContainer
                            sx={{
                                width: '100%',
                                overflowX: 'auto',
                                position: 'relative',
                                display: 'block',
                                maxWidth: '100%',
                                color: 'black',
                                '& td, & th': { whiteSpace: 'nowrap' }
                            }}
                        >
                            <Table
                                aria-labelledby="tableTitle"
                                sx={{
                                    '& .MuiTableCell-root:first-child': {
                                        pl: 2
                                    },
                                    '& .MuiTableCell-root:last-child': {
                                        pr: 3
                                    }
                                }}
                            >
                                <OrderTableHead order={order} orderBy={orderBy} />
                                {reports !== undefined && reports?.length > 0 && (
                                    <TableBody>
                                        {!changeNewData
                                            ? reports !== undefined &&
                                              reports?.length > 0 &&
                                              reports?.map((row, index) => {
                                                  const isItemSelected = isSelected(row.trackingNo);
                                                  const labelId = `enhanced-table-checkbox-${index}`;

                                                  return (
                                                      <>
                                                          <TableRow
                                                              hover
                                                              style={{ color: 'black' }}
                                                              role="checkbox"
                                                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                              aria-checked={isItemSelected}
                                                              tabIndex={-1}
                                                              key={row.trackingNo}
                                                              selected={isItemSelected}
                                                          >
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {row.name}
                                                              </TableCell>
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {row.ip}
                                                              </TableCell>
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {/* <OrderStatus status={row.date} /> */}
                                                                  {row.dateAdd}
                                                              </TableCell>
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                  {row?.os.name}
                                                              </TableCell>
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                  {row?.lastKeepAlive}
                                                              </TableCell>
                                                              <TableCell
                                                                  align="left"
                                                                  style={{ color: 'black', textTransform: 'capitalize' }}
                                                              >
                                                                  {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                  {row?.status}
                                                              </TableCell>
                                                          </TableRow>
                                                      </>
                                                  );
                                              })
                                            : newData?.map((row, index) => {
                                                  const isItemSelected = isSelected(row.trackingNo);
                                                  const labelId = `enhanced-table-checkbox-${index}`;

                                                  return (
                                                      <>
                                                          {row.name !== 'Wazuh-Manager' && (
                                                              <TableRow
                                                                  hover
                                                                  role="checkbox"
                                                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                  aria-checked={isItemSelected}
                                                                  tabIndex={-1}
                                                                  key={index}
                                                                  selected={isItemSelected}
                                                              >
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {row.name}
                                                                  </TableCell>
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {row.ip}
                                                                  </TableCell>
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {/* <OrderStatus status={row.date} /> */}
                                                                      {row.dateAdd}
                                                                  </TableCell>
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                      {row?.os.name}
                                                                  </TableCell>
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                      {row?.lastKeepAlive}
                                                                  </TableCell>
                                                                  <TableCell
                                                                      align="left"
                                                                      style={{ color: 'black', textTransform: 'capitalize' }}
                                                                  >
                                                                      {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                                                      {row?.status}
                                                                  </TableCell>
                                                              </TableRow>
                                                          )}
                                                      </>
                                                  );
                                              })}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}

            {/* {
                <FullScreenDialog
                    showReport={showReport}
                    onClose={closeDialog}
                    clientData={clientData}
                    clientEmail={clientEmail}
                    data={data}
                    report={report}
                    ioc={ioc}
                    cves={cves}
                    affectedProduct={affectedProduct}
                />
            } */}
        </>
    );
}
