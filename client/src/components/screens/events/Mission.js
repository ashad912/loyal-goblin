import React from 'react';
import Box from './Box';
import * as socket from '../../../socket'
import uuid from 'uuid/v1'
import Loading from '../../layout/Loading';

const userItemsName = 'userItems'
const missionItemsName = 'missionItems'

const createTempItemListUser = () => {
  return [
      {
        _id: uuid(),
        model: {
          id: 101,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'diamond',
          imgSrc: 'diamond-amulet.png'
        },
        owner: '35resf23'
      },
      {
        _id: uuid(),
        model: {
          id: 102,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'pearl',
          imgSrc: 'pearl-amulet.png'
      },
        owner: '35resf23'
      },
      {
        _id: uuid(),
        model: {
          id: 103,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'sapphire',
          imgSrc: 'sapphire-amulet.png'
      },
        owner: '35resf23'
      },
      {
        _id: uuid(),
        model: {
          id: 101,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'diamond',
          imgSrc: 'diamond-amulet.png'
        },
        owner: '35resf23'
      },
      

  ]
}

const createTempItemListMission = () => {
  return [
    
      /*{
        _id: uuid(),
        model: {
          id: 103,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'sapphire',
          imgSrc: 'sapphire-amulet.png'
      },
        owner: '35resf23'
      },*/

  ]
}

const backToEvents = (history) => {
    history.push({
      pathname: '/',
      state: {indexRedirect: 1}
    }) 
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Mission extends React.Component {

  state = {
    [userItemsName]: createTempItemListUser(),
    [missionItemsName]: createTempItemListMission(),
  }

 
  componentDidMount() {
    if(this.props.location.state && this.props.location.state.id != null){
      const id = this.props.location.state.id
      console.log(id)
    } else {
      backToEvents(this.props.history)
      //redirection in props.history
    }

    //await from backend generating roomId -> roomId = eventInstanceId
    const randomRoomId = getRandomInt(1, 2)
    //temporary separate room for specific mission
    socket.joinRoomEmit(this.props.location.state.id)

    ////

    socket.joinRoomSubscribe((roomId) => {
      this.setState({
        roomId: roomId
      })
    })
    socket.addItemSubscribe((item) => {
      this.addItemToState(item, missionItemsName)
    })

    socket.deleteItemSubscribe((id) => {
      this.deleteItemFromState(id, missionItemsName)
    })

  }

  handleBack = () => {
    backToEvents(this.props.history)
  }

  addMissionItem = (item) => {
    socket.addItemEmit(item, this.state.roomId)
  }

  deleteMissionItem = (id) => {
    socket.deleteItemEmit(id, this.state.roomId)
  }

  addItemToState = (item, targetKey) => {
    const items = [...this.state[targetKey], item]
    
    this.setState({
      [targetKey]: items
    })
  }

  deleteItemFromState = (id, targetKey) => {
    let items = this.state[targetKey].filter((item) => {
      return item._id !== id
    })

    this.setState({
      [targetKey]: items
    })
  }

  render() {

    if(!this.state.roomId){
      return <Loading/>
    }
    return (
      <React.Fragment>
        <div onClick={this.handleBack}>
          <p>Back</p>
          
        </div>
        <p>SocketIO-RoomId (temporary missionId): {this.state.roomId}</p>
        <div className="drag_things_to_boxes">
            <Box targetKey={userItemsName} items={this.state.userItems} addItem={this.addItemToState} deleteItem={this.deleteItemFromState} boxname='user'/>
            <Box targetKey={missionItemsName} items={this.state.missionItems} addItem={this.addMissionItem} deleteItem={this.deleteMissionItem} boxname='mission' />
        </div>
      </React.Fragment>
    )
  }
}