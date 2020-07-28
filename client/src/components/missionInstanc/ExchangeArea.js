

import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { addItemSubscribe, deleteItemSubscribe } from 'socket'
import Box from './Box';
import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder'

import { sendItemToMission, sendItemToUser } from 'store/actions/missionActions';
import { uiPaths } from 'utils/constants';

const userItemsName = 'userItems'
const missionItemsName = 'missionItems'




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
    try {
      await sendItemToMission(item, this.props.locationId)
      this.addItemToState(item, targetKey)
    } catch (e) {
      console.log(e)
      this.props.handleBack()
    }

    //addItemEmit(socket, item, this.props.locationId)
  }

  deleteMissionItem = async (id, targetKey) => {
    try {
      await sendItemToUser(id, this.props.locationId)
      this.deleteItemFromState(id, targetKey)
    } catch (e) {
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

    if (!destination) {
      return
    }
    const id = result.draggableId
    //console.log(id)
    //console.log(this.state.missionItems.filter((item) => item._id !== id).length)
    //console.log(this.state.userItems.filter((item) => item._id !== id))

    if (source.droppableId !== destination.droppableId) {
      if (source.droppableId === userItemsName) {

        this.addMissionItem(id, destination.droppableId)
        this.deleteItemFromState(id, source.droppableId)


      } else if (source.droppableId === missionItemsName) {

        this.addUserItem(id, destination.droppableId)
        this.deleteMissionItem(id, source.droppableId)


      }

    }


  };

  setDraggableProperty = (draggable) => {
    const { source } = draggable

    this.setState({
      draggableProperty: source.droppableId
    })

  }


  render() {



    return (
      <div style={{ width: '100%' }} data-testid='exchange-area'>
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.setDraggableProperty}>
          <Box
            targetKey={userItemsName}
            image={
              <React.Fragment>
                <AvatarWithPlaceholder
                  avatar={this.props.avatar}
                  width="4rem"
                  height="4rem"
                  center
                  placeholder={{
                    text: this.props.userName,
                    fontSize: '2.2rem'
                  }}
                />
              </React.Fragment>
            }
            items={this.state.userItems}
            draggableProperty={this.state.draggableProperty}
            boxname={userItemsName}
          />
          <Box
            targetKey={missionItemsName}
            image={
              <img style={{ height: '4rem', width: '4rem' }} alt="avatar" src={uiPaths['chest']} />
            }
            items={this.socketShare(this.state.missionItems)}
            draggableProperty={this.state.draggableProperty}
            boxname={missionItemsName}
          />
        </DragDropContext>
      </div>
    )
  }
}