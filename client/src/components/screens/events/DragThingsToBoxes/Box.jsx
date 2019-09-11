import React from 'react';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import BoxItem from './BoxItem';
import shortid from 'shortid' 



export default class Box extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: []
      };
    }
  
    handleDrop = (e) => {
      console.log('drop', this.props.myid)
      let items = this.state.items.slice();
      items.push({label: e.dragData.label, uid: shortid.generate()});
      this.setState({items: items});
      //e.containerElem.style.visibility="hidden";
    };
  
    swap = (fromIndex, toIndex, dragData) => {
      console.log('swap', this.props.myid)
      let items = this.state.items.slice();
      const item = {label: dragData.label, uid: shortid.generate()};
      items.splice(toIndex, 0, item);
      this.setState({items: items});
    };
  
    kill = (uid) => {
      console.log('kill', this.props.myid)
      let items = this.state.items.slice();
      const index = items.findIndex((item) => {
        return item.uid == uid
      });
      if (index !== -1) {
        items.splice(index, 1);
      }
      this.setState({items: items});
    };
  
    render() {

      console.log(this.props)
      //const boxItems = this.props.initList()
      /*
          Note the two layers of DropTarget. 
          This enables it to handle dropped items from 
          outside AND items dragged between boxes.
      */
      return (
        <div className="component_box">
            <DropTarget
              onHit={this.handleDrop}
              targetKey={this.props.targetKey}
              dropData={{name: this.props.name}}
            >
              <DropTarget
                onHit={this.handleDrop}
                targetKey="boxItem"
                dropData={{name: this.props.name}}
              >
                <div className="box">
                  {this.state.items.map((item, index) => {
                    return (
                      <BoxItem key={item.uid} uid={item.uid} kill={this.kill} index={index} swap={this.swap} myid={this.props.myid}>
                        {/*<img style={{height: 20, width:20}} src={require(`../../../../assets/icons/${item.model.imgSrc}`)} alt='icon'/>*/}
                        {item.label}
                      </BoxItem>
                    )
                  })}
                </div>
              </DropTarget>
            </DropTarget>
        </div>
      );
    }
  }