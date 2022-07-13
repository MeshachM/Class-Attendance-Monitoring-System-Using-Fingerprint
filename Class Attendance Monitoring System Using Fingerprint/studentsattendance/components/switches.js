/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const Switches = ({ switches }) => {
    const [state, setState] = useState({
        alarm: '0',
    });

    const onUpdateState = (field, value) => {
        const currentState = { ...state };
        currentState[field] = value;
        setState(currentState);
        fetch('/api/updatecontrols' + `?alarm=${currentState.alarm}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            }).catch((e) => {
                console.log(e.message);
            });
    }

    useEffect(() => {
        if (switches) {
            setState(switches);
        }
    }, [switches]);

    return (
        <FormGroup row >
            <FormControlLabel control={<Switch checked={parseInt(state.alarm) !== 0} onChange={(e) => onUpdateState('alarm', e.target.checked ? '1' : '0')} />} label="Alarm" />
        </FormGroup>
    )
}

export default Switches
