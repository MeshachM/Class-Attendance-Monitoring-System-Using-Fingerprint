/* eslint-disable no-unused-vars */
import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
// Components
import SwitchesComponent from '../../components/switches'
import Header from '../../components/header'
import DataTable from '../../components/datatable'
import DataLoader from '../../components/dataloader'
import DataNotFound from '../../components/datanotfound'
import { ButtonBase, Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 96,
        padding: theme.spacing(0),
        [theme.breakpoints.down('sm')]: {
            marginTop: 64,
            padding: theme.spacing(2)
        }
    },
    button: {
        height: 32,
        marginBottom: 8,
        color: 'white',
        borderRadius: 48,
        padding: '0px 16px',
        backgroundColor: 'green',
    }
}))

const Lessons = ({ toggleTheme }) => {
    const classes = useStyles()
    const router = useRouter()

    const { id } = router.query;

    return (
        <React.Fragment>
            <Head>
                <title>Lessons - Students Attendance.</title>
            </Head>
            <Header toggleTheme={toggleTheme} />
            <Container fixed={true} maxWidth="lg" className={classes.root} >
                <ButtonBase className={classes.button} onClick={() => router.push("/addstudent")} >Add Student</ButtonBase>
                <DataTable user={id} />
            </Container>
        </React.Fragment>
    )
}

export default Lessons