import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import HomePage from './HomePage';
import JoinSessionPage from './JoinSessionPage';
import CreateSessionPage from './CreateSessionPage';
import Session from './Session';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='center'>
        <Router>
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route path='/join' element={<JoinSessionPage />} />
            <Route path='/create' element={<CreateSessionPage />} />
            <Route path='/session/:sessionCode' element={<Session />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
