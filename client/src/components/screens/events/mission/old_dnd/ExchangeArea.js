

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



const createTempItemListUser = (userId) => {
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
        owner: userId
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
        owner: userId
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
        owner: userId
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
        owner: userId
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
        owner: userId
      },
      
      

  ]
}

const createTempItemListMission = (userId) => {
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
        owner: userId
      },*/

  ]
}




export default class ExchangeArea extends React.Component {

  state = {
    [userItemsName]: createTempItemListUser(this.props.userId),
    [missionItemsName]: createTempItemListMission(this.props.userId),
    //all possible items in communication
    
  }
  
  componentWillUnmount() {
    const {socket} = this.state
    socket.disconnect()
  }
 
  componentDidMount() {

    this.setState({
      allItems: [...this.state[userItemsName], ...this.state[missionItemsName]]
    })
   
    const socket =  io('/mission')

    

    //await from backend generating roomId -> roomId = eventInstanceId
    
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

  findItemById = (id) => {
    //console.log(id)
    //console.log(this.state.allItems)
    return this.state.allItems.find((item) => {
      return item._id === id
    })
    

  }
  addMissionItem = (id, targetKey) => {
    
    const item = this.findItemById(id, targetKey)
    //console.log(targetKey, item)
    const {socket} = this.state
    socketFuncs.addItemEmit(socket, item, this.state.roomId)
  }

  deleteMissionItem = (id) => {
    const {socket} = this.state
    socketFuncs.deleteItemEmit(socket, id, this.state.roomId)
  }


  addUserItem = (id, targetKey) => {
    //console.log(targetKey, id)
    const item = this.findItemById(id, targetKey)
    //console.log(targetKey, item)
    this.addItemToState(item, targetKey)
  }

  addItemToState = (item, targetKey) => {
    console.log('add to', targetKey)
    const items = [...this.state[targetKey], item]
    
    this.setState({
      [targetKey]: items
    }, () => {
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


  
  socketShare = (items) => {
    return items.filter((item) => {
      return item.owner === this.props.userId
    })
  }

  
  render() {

    if(!this.state.roomId){
      return <Loading/>
    }
    



    return (
      <React.Fragment>
        
        <p>SocketIO-RoomId (temporary missionId): {this.state.roomId}</p>
        <p>RandomUserId (1-5, can be duplicated -> refresh): {this.props.userId}</p>
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
                <Box 
                    targetKey={userItemsName} 
                    items={this.state.userItems} 
                    addItem={this.addUserItem} 
                    deleteItem={this.deleteItemFromState} 
                    boxname='user'/>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                
            >  
                <Box 
                    targetKey={missionItemsName} 
                    //this.state.missionItems has all items in box from socket point of view - for missionBox there are all clients items
                    //this.socketShare() -> want to show only specific client items in box (for userBox clientItems === props.items)
                    items={this.socketShare(this.state.missionItems)} 
                    addItem={this.addMissionItem} 
                    deleteItem={this.deleteMissionItem} 
                    boxname='mission'/>
            </Grid>  
          {/*<div className="test">
          <Box targetKey={missionItemsName} items={this.state.missionItems} addItem={this.addMissionItem} deleteItem={this.deleteMissionItem} boxname='mission' />
          </div>*/}
        
        </Grid>
      </React.Fragment>
    )
  }
}