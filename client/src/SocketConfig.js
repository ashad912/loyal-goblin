import React from 'react'
import { connect } from "react-redux";
import { updateParty } from "./store/actions/partyActions";
import {socket, joinRoomEmit, joinRoomSubscribe, instanceRefreshEmit, leaveRoomSubscribe, partyRefreshSubscribe, deleteRoomSubscribe} from './socket'
import {authCheck, setMultipleSession } from './store/actions/authActions';
import {setActiveInstance} from './store/actions/missionActions'

class SocketConfig extends React.Component {
  state = {};

  async componentDidMount() {
    


    socket.on('authenticated', () => {
      joinRoomEmit(this.props.party._id)
      setActiveInstance(null, null)
      instanceRefreshEmit(this.props.party._id)
    });
  
    socket.on('unauthorized', (err) => {
      if(err.message === "multipleSession"){

          this.props.setMultipleSession()

      }
      console.log('Socket auth failed: ' + err.message)
    });

    joinRoomSubscribe((roomId) => {
      console.log("New member is now visible in socket - party: " + roomId)
      this.props.onPartyUpdate()
    })

    leaveRoomSubscribe((socketUserIdToLeave) => {
      console.log(this.props.uid, socketUserIdToLeave)
      if(this.props.uid === socketUserIdToLeave && socket.connected){
        socket.disconnect()
      }  
      this.props.onPartyUpdate()
    })

    partyRefreshSubscribe((data) => {
        console.log('partyRefresh')
        this.props.onPartyUpdate()
        if(data.authCheck){
          this.props.authCheck()
        }
    })

    deleteRoomSubscribe((roomId) => {
      if(socket.connected){
        socket.disconnect()
      }
      console.log('deleteRoom')
      this.props.onPartyUpdate()
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
    onPartyUpdate: () => dispatch(updateParty()),
    authCheck: () => dispatch(authCheck()),
    setMultipleSession: () => dispatch(setMultipleSession()),
    setActiveInstance: (id, imgSrc) => dispatch(setActiveInstance(id, imgSrc))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketConfig);
