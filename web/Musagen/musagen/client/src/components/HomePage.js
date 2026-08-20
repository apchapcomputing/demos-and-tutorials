import React, { useState, useEffect } from 'react';
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [sessionCode, setSessionCode] = useState('');

  useEffect(() => {
    fetch('/api/in-session')
      .then((res) => res.json())
      .then((data) => {
        console.log('hello');
        setSessionCode(data.code);
      });
  }, []);

  return sessionCode ? (
    <Redirect to={`/session/${sessionCode}`} />
  ) : (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} align='center'>
          <Typography variant='h3' compact='h3'>
            Musagen
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <ButtonGroup variant='contained' color='primary'>
            <Button color='primary' to='/join' component={Link}>
              Join Session
            </Button>
            <Button color='secondary' to='/create' component={Link}>
              Create Workout
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
