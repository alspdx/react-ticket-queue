import React from 'react';
import Header from './Header';
import TicketList from './TicketList';
import NewTicketControl from './NewTicketControl';
import Error404 from './Error404';
import Admin from './Admin';
import { Switch, Route, withRouter } from 'react-router-dom';
import { v4 } from 'uuid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/* eslint-disable */
import { fromNow } from 'moment';
/* eslint-enable */
class App extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedTicket: null
    };
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this);
    this.handleDeletingSelectedTicket = this.handleDeletingSelectedTicket.bind(this);
  }


  handleChangingSelectedTicket(ticketId){
    this.setState({selectedTicket: ticketId});
  }

  handleDeletingSelectedTicket(ticketId) {
    if (this.state.selectedTicket === ticketId) {
      this.setState({selectedTicket: null});
    }
    let newMasterTicketList = this.state.masterTicketList;
    delete newMasterTicketList[ticketId];
    this.setState({masterTicketList: newMasterTicketList});
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime() {
    // let newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    // Object.keys(newMasterTicketList).forEach(ticketId => {
    //   newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    // });
    // this.setState({masterTicketList: newMasterTicketList});
  }

  render(){
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' render={()=><TicketList ticketList={this.props.masterTicketList} /> } />
          <Route path='/newticket' render={()=><NewTicketControl />} />
          <Route path='/admin' render={(props)=><Admin ticketList={this.props.masterTicketList} currentRouterPath={props.location.pathname}
            onTicketSelection={this.handleChangingSelectedTicket}
            selectedTicket={this.state.selectedTicket}
            onDeleteTicket={this.handleDeletingSelectedTicket} />} />
          <Route component={Error404} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    masterTicketList: state.masterTicketList
  }
}

App.propTypes = {
  masterTicketList: PropTypes.object
}

export default withRouter(connect(mapStateToProps)(App));
