import React, { Component } from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';

import { findIndex, without } from 'lodash';

class App extends Component {

  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0
    }
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  searchApts(query) {
    this.setState({ queryText: query });
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt); // put apt at beginning of array
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt); // lodash method to return object without item
    this.setState({
      myAppointments: tempApts
    })
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({ myAppointments: tempApts });
  }

  toggleForm() {
    this.setState({ formDisplay: !this.state.formDisplay })
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex; // create unique id to iterate through
          this.setState({ lastIndex: this.state.lastIndex + 1 }) // increment unique id index
          return item;
        });
        this.setState({
          myAppointments: apts
        });
      });
  }

  render() {

    let order;
    let filteredApts = this.state.myAppointments;
    order = this.state.orderDir === 'asc' ? 1 : -1;

    filteredApts = filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(eachItem => {
      return (
        eachItem['petName'].toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase()
          .includes(this.state.queryText.toLowerCase())
      )
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments formDisplay={this.state.formDisplay} toggleForm={this.toggleForm} addAppointment={this.addAppointment} />
                <SearchAppointments orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir} 
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts} />
                <ListAppointments appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
