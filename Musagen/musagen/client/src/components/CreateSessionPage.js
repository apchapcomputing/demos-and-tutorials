import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

const defaultVotes = 2;

const CreateSessionPage = () => {
  const navigate = useNavigate();

  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false);
  };

  const handleSessionCreateClicked = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch('/api/create-session', requestOptions)
      .then((res) => res.json())
      .then((data) => navigate('/session/' + data.code));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography component='h4' variant='h4'>
          Create A Workout Session
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <FormControl component='fieldset'>
          <FormHelperText>
            <div align='center'>Guest Control of Playback state</div>
            <RadioGroup
              row
              defaultValue='true'
              onChange={handleGuestCanPauseChange}>
              <FormControlLabel
                value='true'
                control={<Radio color='primary' />}
                label='Play/Pause'
                labelPlacement='bottom'
              />
              <FormControlLabel
                value='false'
                control={<Radio color='secondary' />}
                label='No Control'
                labelPlacement='bottom'
              />
            </RadioGroup>
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} align='center'>
        <FormControl>
          <TextField
            required={true}
            type='number'
            onChange={handleVotesChange}
            defaultValue={defaultVotes}
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
          />
          <FormHelperText>
            <div align='center'>Votes required to skip a song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align='center'>
        <Button
          color='primary'
          variant='contained'
          onClick={handleSessionCreateClicked}>
          Create a Workout Session
        </Button>
        <br />
        <Button color='secondary' variant='contained' to='/' component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateSessionPage;
