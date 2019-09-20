import React from 'react';
import { DropTarget } from 'react-drag-drop-container';
import BoxItem from './BoxItem'; 



export default class Box extends React.Component {
  
    constructor(props) {
      super(props);
    }

    handleDrop = (e) => {
      const item = e.dragData
      this.props.addItem(item, this.props.targetKey)
    };

    kill = (id) => {
      this.props.deleteItem(id, this.props.targetKey)
    };

  
  
    render() {

      const items = this.props.items //from backend

      return (
        <div className="component_box">
            <DropTarget
              onHit={this.handleDrop}
              targetKey="boxItem"
              dropData={{name: this.props.name}}
            >
              <div className="box">
                {items.map((item, index) => {
                  return (
                    <BoxItem key={item._id} kill={this.kill} boxname={this.props.boxname} item={item}>
                      {item.model.imgSrc}
                    </BoxItem>
                  )
                })}
              </div>
            </DropTarget>
        </div>
      );
    }
  }