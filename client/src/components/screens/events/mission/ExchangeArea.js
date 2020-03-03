

import React from 'react';
import Box from './Box';

import uuid from 'uuid/v1'
import {addItemSubscribe, deleteItemSubscribe} from '../../../../socket'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import bagImg from '../../../../assets/mission/bag.png'
import { sendItemToMission, sendItemToUser } from '../../../../store/actions/missionActions';


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
    [userItemsName]: this.props.initUserItems,
    [missionItemsName]: this.props.initMissionItems,
  }
  
  

  
 
  componentDidMount() {

    this.setState({
      allItems: [...this.state[userItemsName], ...this.state[missionItemsName]]
    })
   
    
    addItemSubscribe((item) => {
      this.addItemToState(item, missionItemsName)
    })

    deleteItemSubscribe((id) => {
      this.deleteItemFromState(id, missionItemsName)
    })
  }

  findItemById = (id) => {
    return this.state.allItems.find((item) => {
      return item._id === id
  })
    

  }
  addMissionItem = async (id, targetKey) => {
    
    const item = this.findItemById(id, targetKey)
    //console.log(targetKey, item)
    try{
      await sendItemToMission(item, this.props.locationId)
      this.addItemToState(item, targetKey)
    }catch(e){
      console.log(e)
      this.props.handleBack()
    }
    
    //addItemEmit(socket, item, this.props.locationId)
  }

  deleteMissionItem = async (id, targetKey) => {
    try{
      await sendItemToUser(id, this.props.locationId)
      this.deleteItemFromState(id, targetKey)
    }catch(e){
      console.log(e)
      this.props.handleBack()
    }
    //deleteItemEmit(socket, id, this.props.locationId)
  }


  addUserItem = (id, targetKey) => {
    //console.log(targetKey, id)
    const item = this.findItemById(id, targetKey)
    //console.log(targetKey, item)
    this.addItemToState(item, targetKey)
  }

  addItemToState = (item, targetKey) => {
    //console.log('add to', targetKey)
    const items = [...this.state[targetKey], item]
    
    this.setState({
      [targetKey]: items
    }, () => {
        this.props.instanceItems(this.state.missionItems)
        
    })
  }

  deleteItemFromState = (id, targetKey) => {
    //console.log('delete from', targetKey)
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
    //console.log(result)
    const { source, destination } = result;

    if(!destination) {
      return
    }
    const id = result.draggableId
   // console.log(id)
    //console.log(this.state.missionItems.filter((item) => item._id !== id).length)
    //console.log(this.state.userItems.filter((item) => item._id !== id))
 
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



    return (
      <div style={{width: '100%'}}>
        
        
        
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.setDraggableProperty}>
        
             
                <Box 
                    targetKey={userItemsName} 
                    items={this.state.userItems} 
                    draggableProperty={this.state.draggableProperty}
                    boxname={userItemsName}
                    userName ={this.props.userName}
                    boxIcon={this.props.avatar}/>
                    
            
             
                <Box 
                    targetKey={missionItemsName}
                    items={this.socketShare(this.state.missionItems)} 
                    draggableProperty={this.state.draggableProperty}
                    boxname={missionItemsName}
                    boxIcon={bagImg}/>    
        
        </DragDropContext>
      </div>
    )
  }
}