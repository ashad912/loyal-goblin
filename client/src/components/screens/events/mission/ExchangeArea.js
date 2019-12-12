

import React from 'react';
import Box from './Box';

import uuid from 'uuid/v1'
import Loading from '../../../layout/Loading';
import Grid from '@material-ui/core/Grid';
import * as socketFuncs from '../../../../socket'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import avatarTemp from '../../../../assets/avatar/moose.png'
import bagImg from '../../../../assets/avatar/bag.png'
import Cookies from 'js-cookie';
import {socket} from '../../../../socket'

// import io from 'socket.io-client'
// export const socket =  io('/mission', {
//   autoConnect: false,

// })


const userItemsName = 'userItems'
const missionItemsName = 'missionItems'

const StyledP = styled.p`
    font-size: 8px;
    margin-block-start: 0.25em;
    margin-block-end: 0.25em;
    color: ${props => props.userRegistered ? 'green' : 'black'} 
`



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
      // {
      //   _id: uuid(),
      //   model: {
      //     _id: 104,
      //     type: {
      //         id: 204,
      //         type: 'amulet'
      //     },
      //     name: 'emerald',
      //     imgSrc: 'emerald-amulet.png'
      //   },
      //   owner: userId
      // },
      
      

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
    roomId: null,
    userRegistered: false,
    //connectedUsers: [/*from backend*/],
    [userItemsName]: createTempItemListUser(this.props.userId),
    [missionItemsName]: createTempItemListMission(this.props.userId),
    //all possible items in communication
    
  }
  
  

  
 
  componentDidMount() {

    this.setState({
      allItems: [...this.state[userItemsName], ...this.state[missionItemsName]]
    })
   
    
    // console.log(socket)
    // //await from backend generating roomId -> roomId = missionInstanceId
    
    // //temporary separate room for specific mission
    // console.log(this.props.locationId)
    // socketFuncs.joinRoomEmit(socket, this.props.locationId)

    // ////
    // if(!this.state.roomId){
    //   socketFuncs.joinRoomSubscribe((roomId) => {
    //     this.setState({
    //       socket: socket,
    //       roomId: roomId,
    //     }, () => {
    //         this.props.setConnection(roomId)  
    //     })
    //   })
    //}
    
    socketFuncs.addItemSubscribe((item) => {
      this.addItemToState(item, missionItemsName)
    })

    socketFuncs.deleteItemSubscribe((id) => {
      this.deleteItemFromState(id, missionItemsName)
    })

    // socketFuncs.registerUserSubscribe((user) => {

    //   const users = [...this.state.connectedUsers, user]

    //   this.setState({
    //     connectedUsers: users
    //   }, () => {
    //     this.props.instanceUsers(this.state.connectedUsers) 
    //   })
    // })

    // socketFuncs.unregisterUserSubscribe(socket, (id) => {

    //   const users = this.state.connectedUsers.filter((user) => {
    //     return user._id !== id
    //   })

    //   this.setState({
    //     connectedUsers: users
    //   }, () => {
    //     this.props.instanceUsers(this.state.connectedUsers)
    //   })
    // })

    // socketFuncs.modifyUserStatusSubscribe(socket, (user) => {
      
    //   const users = [...this.state.connectedUsers];
  
    //   const modifyUserArrayIndex = users.findIndex(
    //     specificUser => {
    //       return specificUser._id === user._id;
    //     }
    //   );
      
    //   users[modifyUserArrayIndex].readyStatus = user.readyStatus;

    //   this.setState({
    //     connectedUsers: users
    //   }, () => {
    //     this.props.instanceUsers(this.state.connectedUsers) 
    //   })
    // })

  }

  // componentDidUpdate(prevProps) {
  //   if (this.state.roomId && (prevProps.userReadyStatus !== this.props.userReadyStatus)) {
  //     //const {socket} = this.state
  //     const user = {_id: this.props.userId, readyStatus: this.props.userReadyStatus}
  //     socketFuncs.modifyUserStatusEmit(socket, user, this.state.roomId)
  //   }
  // } 

  // componentWillUnmount() {
  //   const {socket} = this.state
  //   socketFuncs.unregisterUserEmit(socket, this.props.userId, this.state.roomId)
  //   //socket.disconnect()
  // }

  // handleRegister = () => {
  //   if(!this.state.userRegistered){
  //     this.setState({
  //       userRegistered: true
  //     }, () => {
        
  //       //const {socket} = this.state
  //       console.log(socket)
  //       //socket.open()
  //       const user = {_id: this.props.userId, readyStatus: false}
  //       socketFuncs.registerUserEmit(socket, user, this.state.roomId)
  //     })
  //   }  
  // }

  findItemById = (id) => {
    return this.state.allItems.find((item) => {
      return item._id === id
  })
    

  }
  addMissionItem = (id, targetKey) => {
    
    const item = this.findItemById(id, targetKey)
    //console.log(targetKey, item)
    const {socket} = this.state
    socketFuncs.addItemEmit(socket, item, this.props.locationId)
  }

  deleteMissionItem = (id) => {
    const {socket} = this.state
    socketFuncs.deleteItemEmit(socket, id, this.props.locationId)
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

  onDragEnd = (result) => {
    console.log(result)
    const { source, destination } = result;

    if(!destination) {
      return
    }
    const id = result.draggableId
    console.log(id)
 
    if (source.droppableId !== destination.droppableId) {
      if(source.droppableId === userItemsName){
        this.addMissionItem(id, destination.droppableId)
        this.deleteItemFromState(id, source.droppableId)
      }else if(source.droppableId === missionItemsName){
        this.addUserItem(id, destination.droppableId)
        this.deleteMissionItem(id, source.droppableId)
      }
      
    }

    
  };

  setDraggableProperty = (draggable) => {
    const {source} = draggable

    this.setState({
      draggableProperty: source.droppableId
    })

  }
  
  
  render() {

    // if(!this.state.roomId){
    //   return <Loading/>
    // }
    
    const registerLabel = this.state.userRegistered ? ('User registered!') : ('Register user in SocketIO!')


    return (
      <div>
        
        
        
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.setDraggableProperty}>
        
             
                <Box 
                    targetKey={userItemsName} 
                    items={this.state.userItems} 
                    draggableProperty={this.state.draggableProperty}
                    boxname={userItemsName}
                    boxIcon={avatarTemp}/>
            
             
                <Box 
                    targetKey={missionItemsName}
                    //this.state.missionItems has all items in box from socket point of view - for missionBox there are all clients items
                    //this.socketShare() -> want to show only specific client items in box (for userBox clientItems === props.items)
                    items={this.socketShare(this.state.missionItems)} 
                    draggableProperty={this.state.draggableProperty}
                    boxname={missionItemsName}
                    boxIcon={bagImg}/>
              
          {/*<div className="test">
          <Box targetKey={missionItemsName} items={this.state.missionItems} addItem={this.addMissionItem} deleteItem={this.deleteMissionItem} boxname='mission' />
          </div>*/}
        
        
        </DragDropContext>
        <StyledP onClick={this.handleRegister} userRegistered={this.state.userRegistered}>{registerLabel}</StyledP>
      </div>
    )
  }
}