

import React from 'react';
import Box from './Box';
import io from 'socket.io-client'
import uuid from 'uuid/v1'
import Loading from '../../../layout/Loading';
import Grid from '@material-ui/core/Grid';
import * as socketFuncs from '../../../../socket'
import styled from 'styled-components'




const userItemsName = 'userItems'
const missionItemsName = 'missionItems'

const createTempItemListUser = () => {
  return [
      {
        _id: uuid(),
        model: {
          _id: 101,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'diamond',
          imgSrc: 'diamond-amulet.png'
        },
        owner: 1
      },
      {
        _id: uuid(),
        model: {
          _id: 102,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'pearl',
          imgSrc: 'pearl-amulet.png'
        },
        owner: 2
      },
      {
        _id: uuid(),
        model: {
          _id: 103,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'sapphire',
          imgSrc: 'sapphire-amulet.png'
        },
        owner: 3
      },
      {
        _id: uuid(),
        model: {
          _id: 101,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'diamond',
          imgSrc: 'diamond-amulet.png'
        },
        owner: 4
      },
      {
        _id: uuid(),
        model: {
          _id: 103,
          type: {
              id: 201,
              type: 'amulet'
          },
          name: 'sapphire',
          imgSrc: 'sapphire-amulet.png'
        },
        owner: 5
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


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class ExchangeArea extends React.Component {

  state = {
    [userItemsName]: createTempItemListUser(),
    [missionItemsName]: createTempItemListMission(),
  }
  
  componentWillUnmount() {
    const {socket} = this.state
    socket.disconnect()
  }
 
  componentDidMount() {
   
    const socket =  io('/mission')

    

    //await from backend generating roomId -> roomId = eventInstanceId
    const randomRoomId = getRandomInt(1, 2)
    //temporary separate room for specific mission
    socketFuncs.joinRoomEmit(socket, this.props.locationId)

    ////
    if(!this.state.roomId){
      socketFuncs.joinRoomSubscribe(socket, (roomId) => {
        this.setState({
          socket: socket,
          roomId: roomId
        }, () => {
            this.props.setConnection()
        })
      })
    }
    
    socketFuncs.addItemSubscribe(socket, (item) => {
      this.addItemToState(item, missionItemsName)
    })

    socketFuncs.deleteItemSubscribe(socket, (id) => {
      this.deleteItemFromState(id, missionItemsName)
    })

  }

  addMissionItem = (item) => {
    const {socket} = this.state
    socketFuncs.addItemEmit(socket, item, this.state.roomId)
  }

  deleteMissionItem = (id) => {
    const {socket} = this.state
    socketFuncs.deleteItemEmit(socket, id, this.state.roomId)
  }

  addItemToState = (item, targetKey) => {
    console.log('add to', targetKey)
    const items = [...this.state[targetKey], item]
    
    this.setState({
      [targetKey]: items
    }, () => {
        console.log(this.state.userItems)
        this.props.instanceItems(this.state.missionItems)
    })
  }

  deleteItemFromState = (id, targetKey) => {
    console.log('delete from', targetKey)
    let items = this.state[targetKey].filter((item) => {
      return item._id !== id
    })

    this.setState({
      [targetKey]: items
    }, () => {
        this.props.instanceItems(this.state.missionItems)
    })
  }

  
  render() {

    if(!this.state.roomId){
      return <Loading/>
    }
    



    return (
      <React.Fragment>
        
        <p>SocketIO-RoomId (temporary missionId): {this.state.roomId}</p>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                
            >  
                <Box targetKey={userItemsName} items={this.state.userItems} addItem={this.addItemToState} deleteItem={this.deleteItemFromState} boxname='user'/>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                
            >  
                <Box targetKey={missionItemsName} items={this.state.missionItems} addItem={this.addMissionItem} deleteItem={this.deleteMissionItem} boxname='mission'/>
            </Grid>  
          {/*<div className="test">
          <Box targetKey={missionItemsName} items={this.state.missionItems} addItem={this.addMissionItem} deleteItem={this.deleteMissionItem} boxname='mission' />
          </div>*/}
        
        </Grid>
      </React.Fragment>
    )
  }
}