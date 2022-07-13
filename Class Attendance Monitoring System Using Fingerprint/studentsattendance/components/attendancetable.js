/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Table from '@material-ui/core/Table'
import moment from 'moment'
import { Button, ButtonBase, CircularProgress, SvgIcon } from '@material-ui/core'
import { Check, Close, RemoveRedEye, VerifiedUser } from '@material-ui/icons'
import { green, red } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    head: {
        fontWeight: 'bold'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    loader: {
        textAlign: 'center',
    },
    mark: {
        width: 24,
        height: 24,
        borderRadius: 24,
        float: 'right'
    },
    normal: {
        backgroundColor: '#4caf50'
    },
    warning: {
        backgroundColor: '#ff9800'
    },
    danger: {
        backgroundColor: '#f44336'
    }
}))

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.hover
        }
    },
}))(TableRow)

const DataTable = ({ lesson }) => {
    const classes = useStyles()

    const [loading, setLoading] = useState(false);
    const [printing, setPrinting] = useState(false);
    const [attendances, setAttendances] = useState([]);

    const onFetchAttendances = async (id) => {
        setLoading(true);
        try {
            const response = await fetch('/api/getattendance' + `?id=${lesson}`, { method: 'GET' });
            if (response) {
                const stuffs = await response.json();
                setAttendances(stuffs);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    }

    const onPrintPDF = () => {
        var content = document.getElementById("printedpdf");
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    useEffect(() => {
        onFetchAttendances(lesson);
    }, [lesson]);


    return (
        <>
            {
                loading ?
                    <div className={classes.loader} >
                        <CircularProgress />
                    </div>
                    :
                    <>
                        <h3 className={classes.header} ><ButtonBase onClick={onPrintPDF} >Export PDF</ButtonBase></h3>
                        <div>
                            <TableContainer >
                                <Table size="small" className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.head} align="left">Student</StyledTableCell>
                                            <StyledTableCell className={classes.head} align="left">Lesson</StyledTableCell>
                                            <StyledTableCell className={classes.head} align="right"><VerifiedUser /></StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendances.map((row) => (
                                            <StyledTableRow key={row._id}>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">Lesson</TableCell>
                                                <TableCell align="right">
                                                    {
                                                        row.attendance && row.attendance._id ? <SvgIcon style={{ color: green[500] }} ><Check /></SvgIcon> : <SvgIcon style={{ color: red[500] }} ><Close /></SvgIcon>
                                                    }
                                                </TableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div id="printedpdf" style={{ display: 'none' }} >
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Lesson</th>
                                        <th>Attended?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.map((row) => (
                                        <tr key={row._id}>
                                            <td align="left">{row.name}</td>
                                            <td align="left">Lesson</td>
                                            <td align="right">
                                                {
                                                    row.attendance && row.attendance._id ? 'Yes' : 'No'
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <iframe id="ifmcontentstoprint" style={{ height: 0, width: 0, position: 'absolute' }}></iframe>
                    </>
            }
        </>
    )
}

export default DataTable