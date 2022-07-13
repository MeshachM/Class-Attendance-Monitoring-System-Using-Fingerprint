/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Table from '@material-ui/core/Table'
import moment from 'moment';
import { useRouter } from 'next/router';
import { RemoveRedEye, VerifiedUser } from '@material-ui/icons';
import { Button, ButtonBase, CircularProgress } from '@material-ui/core';

const ROWS = [
  { name: 'Lesson 1', time: moment().format('HH:mm') + ' - ' + moment().add(1, 'hour').format('HH:mm') },
  { name: 'Lesson 2', time: moment().add(2, 'hour').format('HH:mm') + ' - ' + moment().add(3, 'hour').format('HH:mm') },
  { name: 'Lesson 3', time: moment().add(4, 'hour').format('HH:mm') + ' - ' + moment().add(5, 'hour').format('HH:mm') }
]

const useStyles = makeStyles(theme => ({
  head: {
    fontWeight: 'bold'
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
  button: {
    fontWeight: 700
  }
}))(TableRow)

const DataTable = ({ rows, user }) => {
  const classes = useStyles()
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFetchLessons = async (id) => {
    setLoading(true);
    try {
      const response = await fetch('/api/getlessons' + `?id=${id}`, { method: 'GET' });
      if (response) {
        const stuffs = await response.json();
        setLessons(stuffs);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    onFetchLessons(user);
  }, [user])

  return (
    <>
      {
        loading ?
          <div className={classes.loader} >
            <CircularProgress />
          </div>
          :
          <TableContainer >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className={classes.head} align="left">Lesson</StyledTableCell>
                  <StyledTableCell className={classes.head} align="left">Time</StyledTableCell>
                  <StyledTableCell className={classes.head} align="right"><VerifiedUser /></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((row) => (
                  <StyledTableRow key={row._id}>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{moment(row.time).format('HH:mm') + ' - ' + moment(row.time).add(30, 'minutes').format('HH:mm')}</TableCell>
                    <TableCell align="right"><ButtonBase onClick={() => router.push(`/attendances/${row._id}`)} className={classes.button} ><RemoveRedEye /></ButtonBase></TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </>
  )
}

export default DataTable
