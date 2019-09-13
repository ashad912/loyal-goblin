import React from 'react';
import Box from './Box';
import './DragThingsToBoxesDemo.css';


const createTempItemListUser = () => {
  return [
      {
        _id: 1,
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
        _id: 2,
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
        _id: 3,
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
    
      {
        _id: 4,
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

  ]
}

const backToEvents = (history) => {
  history.push({
    pathname: '/',
    state: {indexRedirect: 1}
  }) 
}

export default class DragThingsToBoxesDemo extends React.Component {

 
  componentDidMount() {
    if(this.props.location.state && this.props.location.state.id != null){
      const id = this.props.location.state.id
      console.log(id)
      //this.props.history.replace('', null);
    } else {
      backToEvents(this.props.history)
      //redirection in props.history
    }
  }

  handleBack = () => {
    backToEvents(this.props.history)
  }

  render() {
    console.log(this.props)
    return (
      <React.Fragment>
        <div onClick={this.handleBack}>
          <p>Back</p>
        </div>
        <div className="drag_things_to_boxes">
            <Box targetKey="box" initList={createTempItemListUser} boxname='user'/>
            <Box targetKey="box" initList={createTempItemListMission} boxname='mission'/>
        </div>
      </React.Fragment>
    )
  }
}