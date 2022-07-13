/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
// Components
import Header from '../components/header'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { IconButton, InputAdornment, ButtonBase, Input, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 96,
    padding: theme.spacing(0),
    [theme.breakpoints.down('sm')]: {
      marginTop: 64,
      padding: theme.spacing(2)
    }
  },
  form: {
    width: 320,
    margin: '240px auto auto'
  },
  input: {
    marginTop: 16,
    height: 36,
    width: '100%'
  },
  button: {
    height: 48,
    fontSize: 16,
    width: '100%',
    marginTop: 24,
    fontWeight: 700,
    borderRadius: 32,
    color: '#ffffff',
    backgroundColor: theme.palette.primary.light

  }
}))

const Index = ({ toggleTheme }) => {
  const classes = useStyles()
  const router = useRouter()

  const [id, setId] = useState('');
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (id && password === "admin") {
      setLoading(true);
      try {
        const response = await fetch('/api/getuser' + `?id=${id}`, { method: 'GET' });
        if (response) {
          const user = await response.json();
          if (user._id) {
            setLoading(false);
            router.push(`/lessons/${user._id}`);
          } else {
            setLoading(false);
            Alert('No User Found');
          }
        } else {
          setLoading(false);
          Alert('Sorry An error occured');
        }
      } catch (e) {
        setLoading(false);
      }
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Students Attendance.</title>
      </Head>
      <Header toggleTheme={toggleTheme} />
      <Container fixed={true} maxWidth="lg" className={classes.root} >
        <div className={classes.form} >
          <Input className={classes.input} placeholder='ID' value={id} onChange={(e) => setId(e.target.value)} />
          <br />
          <Input className={classes.input} type="password" placeholder='Password'
            value={password} onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShow(!show)}
                >
                  {show ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <ButtonBase onClick={onLogin} className={classes.button} >{loading ? <CircularProgress color='secondary' /> : <>Sign in</>}</ButtonBase>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default Index
