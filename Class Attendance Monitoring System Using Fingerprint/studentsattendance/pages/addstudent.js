/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
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
import { ButtonBase, CircularProgress, TextField } from '@material-ui/core'

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
        marginTop: 8,
        color: 'white',
        borderRadius: 48,
        padding: '0px 16px',
        backgroundColor: 'green',
    }
}))

const Student = ({ toggleTheme }) => {
    const classes = useStyles()
    const router = useRouter()

    const [state, setState] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const onUpdateState = (field, value) => {
        const currentState = { ...state };
        currentState[field] = value;
        setState(currentState);
    }

    const onAddStudent = async () => {
        if (state.id && state.name && state.lecture) {
            setSubmitting(true);
            try {
                const response = await fetch('/api/addstudent' + `?id=${state.id}&name=${state.name}&lecture=${state.lecture}`, { method: 'GET' });
                if (response) {
                    setSubmitting(false);
                    router.back();
                } else {
                    setSubmitting(false);
                }
            } catch (e) {
                setSubmitting(false);
            }
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Attendance - Students Attendance.</title>
            </Head>
            <Container fixed={true} maxWidth="lg" className={classes.root} >
                <h3>Add Student</h3>
                <TextField value={state.id} onChange={(e) => onUpdateState('id', e.target.value)} id="standard-basic" label="ID" />
                <br />
                <TextField value={state.name} onChange={(e) => onUpdateState('name', e.target.value)} id="standard-basic" label="Name" />
                <br />
                <TextField value={state.lecture} onChange={(e) => onUpdateState('lecture', e.target.value)} id="standard-basic" label="lecture ID" />
                <br />
                <ButtonBase onClick={onAddStudent} className={classes.button} >{submitting ? <CircularProgress /> : 'Save'}</ButtonBase>
            </Container>
        </React.Fragment>
    )
}

export default Student;