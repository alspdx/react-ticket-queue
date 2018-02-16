import React from 'react';
import Header from './Header';
import TicketList from './TicketList';
import NewTicketControl from './NewTicketControl';
import Error404 from './Error404';
import Admin from './Admin';
import { Switch, Route } from 'react-router-dom';
import Moment from 'moment';
import { v4 } from 'uuid';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      masterTicketList: {},
      selectedTicket: null
    };
    this.handleAddingNewTicketToList = this.handleAddingNewTicketToList.bind(this);
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this);
    this.handleDeletingSelectedTicket = this.handleDeletingSelectedTicket.bind(this);
  }

  handleAddingNewTicketToList(newTicket) {
    let newTicketId = v4();
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList, {
      [newTicketId]: newTicket
    });
    newMasterTicketList[newTicketId].formattedWaitTime = newMasterTicketList[newTicketId].timeOpen.fromNow(true);
    this.setState({masterTicketList: newMasterTicketList});
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
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    Object.keys(newMasterTicketList).forEach(ticketId => {
      newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    });
    this.setState({masterTicketList: newMasterTicketList});
  }

  render(){
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' render={()=><TicketList ticketList={this.state.masterTicketList} /> } />
          <Route path='/newticket' render={()=><NewTicketControl onNewTicketCreation={this.handleAddingNewTicketToList} />} />
          <Route path='/admin' render={(props)=><Admin ticketList={this.state.masterTicketList} currentRouterPath={props.location.pathname}
            onTicketSelection={this.handleChangingSelectedTicket}
            selectedTicket={this.state.selectedTicket}
            onDeleteTicket={this.handleDeletingSelectedTicket} />} />
          <Route component={Error404} />
        </Switch>
      </div>
    );
  }
}

export default App;
