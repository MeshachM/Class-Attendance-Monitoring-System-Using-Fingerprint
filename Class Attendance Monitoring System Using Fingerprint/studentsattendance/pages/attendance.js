/* eslint-disable no-unused-vars */
import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
// Components
import SwitchesComponent from '../components/switches'
import Header from '../components/header'
import DataTable from '../components/attendancetable'
import DataLoader from '../components/dataloader'
import DataNotFound from '../components/datanotfound'

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 96,
        padding: theme.spacing(0),
        [theme.breakpoints.down('sm')]: {
            marginTop: 64,
            padding: theme.spacing(2)
        }
    }
}))

const Attendance = ({ toggleTheme }) => {
    const classes = useStyles()
    const router = useRouter()

    return (
        <React.Fragment>
            <Head>
                <title>Attendance - Students Attendance.</title>
            </Head>
            <Header toggleTheme={toggleTheme} />
            <Container fixed={true} maxWidth="lg" className={classes.root} >
                <DataTable rows={[]} />
            </Container>
        </React.Fragment>
    )
}

export default Attendance