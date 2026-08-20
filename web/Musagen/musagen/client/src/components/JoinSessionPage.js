import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography } from '@material-ui/core';

const JoinSessionPage = () => {
  const navigate = useNavigate();

  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');

  const handleTextFieldChange = (e) => {
    setSessionCode(e.target.value);
  };

  const joinButtonPressed = () => {
    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sessionCode }),
    };

    fetch('/api/join-session', reqOptions)
      .then((res) => {
        if (res.ok) {
          navigate(`/session/${sessionCode}`);
        } else {
          setError('Session not found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Typography variant='h4' component='h4'>
            Join a Workout Session
          </Typography>
        </Grid>

        <Grid item xs={12} align='center'>
          <TextField
            error={error}
            label='Session Code'
            placeholder='Enter a session code'
            value={sessionCode}
            helperText={error}
            variant='outlined'
            onChange={handleTextFieldChange}
          />
        </Grid>

        <Grid item xs={12} align='center'>
          <Button
            variant='contained'
            color='primary'
            onClick={joinButtonPressed}>
            Join
          </Button>
        </Grid>

        <Grid item xs={12} align='center'>
          <Button variant='contained' color='secondary' to='/' component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default JoinSessionPage;
