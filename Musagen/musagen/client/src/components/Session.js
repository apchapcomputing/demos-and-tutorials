import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Session = (props) => {
  const params = useParams();
  const sessionCode = params.sessionCode;

  const [votesToSkip, setVotesToSkip] = React.useState(2);
  const [guestCanPause, setGuestCanPause] = React.useState(false);
  const [isHost, setIsHost] = React.useState(false);

  useEffect(() => {
    getSessionDetails();
  }, [sessionCode]);

  const getSessionDetails = () => {
    fetch('/api/get-session' + '?code=' + sessionCode)
      .then((res) => res.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  };

  return (
    <div>
      Hey, I am a session.
      <h3>{sessionCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Guest Can Pause: {guestCanPause.toString()}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
};

export default Session;
