import React from 'react';
import { DropTarget } from 'react-drag-drop-container';
import './Highlighted.css'

import BoxItem from './BoxItem'; 

import Grid from '@material-ui/core/Grid';


const Box = (props) => {
  

    const handleDrop = (e) => {
      const item = e.dragData
      props.addItem(item, props.targetKey)
    };

    const kill = (id) => {
      props.deleteItem(id, props.targetKey)
    };

  

    const items = props.items //from backend

    return (
      

        <div className="component_box">
            <DropTarget
              onHit={handleDrop}
              targetKey="boxItem"
              dropData={{name: props.name}}
            >
              <div className="box">
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
              >
                {items.map((item, index) => {
                  return (
                    
                    <BoxItem key={item._id} kill={kill} boxname={props.boxname} item={item}>
                      {item.model.imgSrc}
                    </BoxItem>
                    
                  )
                })}
                </Grid>
              </div>
            </DropTarget>
        </div>
      );
    }

  export default Box