import React from 'react'
import { connect } from "react-redux";
import { updateParty } from "./store/actions/partyActions";
import {socket, socketAuthenticatedSubscribe, socketUnauthorizedSubscribe, joinPartyEmit, joinPartySubscribe, refreshMissionsSubscribe, leavePartySubscribe, refreshPartySubscribe, deletePartySubscribe} from './socket'
import {authCheck, setMultipleSession } from './store/actions/authActions';
import {getMissionList} from './store/actions/missionActions'

class SocketConfig extends React.Component {
  state = {};

  async componentDidMount() {
    
    socketAuthenticatedSubscribe(() => {
      joinPartyEmit(this.props.party._id)
      this.props.missionsUpdate()
    });
  
    socketUnauthorizedSubscribe((err) => {
      console.log(err)
      console.log(err.response)
      if(err.message === "multipleSession"){
        this.props.setMultipleSession()
      }
      console.log('Socket auth failed: ' + err.message)
    });

    joinPartySubscribe((roomId) => {
      console.log("New member is now visible in socket - party: " + roomId)
      this.props.partyUpdate()
      this.props.missionsUpdate()
    })

    leavePartySubscribe((socketUserIdToLeave) => {
      console.log(this.props.uid, socketUserIdToLeave) 
      this.props.partyUpdate()
      this.props.missionsUpdate()
    })

    refreshPartySubscribe(() => {
      console.log('partyRefresh')
      this.props.partyUpdate()
      this.props.missionsUpdate()
    })

    deletePartySubscribe((roomId) => {
      if(socket.connected){
        socket.disconnect()
      }
      console.log('deleteRoom')
      this.props.partyUpdate()
      this.props.missionsUpdate()
    })

    refreshMissionsSubscribe((roomId) => {
      this.props.missionsUpdate()
    })
     
  }

  render() {
    return (
      null
    );
  }
}
const mapStateToProps = state => {
  return {
      uid: state.auth.uid,
      party: state.party
  };
};


const mapDispatchToProps = dispatch => {
  return {
    partyUpdate: () => dispatch(updateParty()),
    missionsUpdate: () => dispatch(getMissionList()),
    authCheck: () => dispatch(authCheck()),
    setMultipleSession: () => dispatch(setMultipleSession()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketConfig);
