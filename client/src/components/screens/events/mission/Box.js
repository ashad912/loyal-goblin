import React, {useState} from 'react';
import { DropTarget } from 'react-drag-drop-container';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BoxItem from './BoxItem'; 
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'
import './Highlighted.css'
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const StyledBox = styled.div`
  border: 1px solid black;
	width: 300px;
  height: 78px;
	margin: 0px 0px 0 0;
  position: relative;
  box-shadow: ${props => {
       return props.highlighted ? 'inset 0 0 4px #00f' : 'none'
  }}
  
`;

const RootDiv = styled.div`
    flex-grow: 1;
    margin-left: 28px;
    margin-right: 28px;
    margin-top: 5px;
`
const StyledPaper = styled(Paper)`
    min-height: 80px;
    text-align: 'center';
    color: rgba(0, 0, 0, 0.54);
`
const converted = { ".highlighted  .box": { boxShadow: "inset 0 0 4px #00f" } };

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginLeft: 28,
    marginRight: 28,
    marginTop: 5

    
  },
  paper: {
    minHeight: 80,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const convertToStack = (itemsToConvert, tK) => {
  let itemModels = []
  itemsToConvert.forEach((itemToConvert) => {
    //NOTE: filter returns new array - if for itemModels get zero length, it is new name
    if(itemModels.filter(itemModel => itemModel.name === itemToConvert.model.name).length === 0){
      itemModels = [...itemModels, itemToConvert.model]
    }
  })

  let itemObjects = []
  itemModels.forEach((itemModel) => {
    let instanceItems = []
    itemsToConvert.forEach((itemToConvert) => {
      if(itemModel.name === itemToConvert.model.name){
        instanceItems = [...instanceItems, itemToConvert]
      }
    })
    const itemObject = {model: itemModel, instances: instanceItems}
    itemObjects = [...itemObjects, itemObject]
  })
  return itemObjects
}


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
    minHeight: 200
});


const Box = (props) => {

  

  

    
    //convert client items to stack view
    const items = convertToStack(props.items, props.addTargetKey) //from backend

    const classes = useStyles();
    return (
          <RootDiv >
            <Grid
              
              container
              direction="row"
              justify="center"
              alignItems="center"
              className={classes.wrapper}
              spacing={1}
          >
          <Grid item xs={3}>
            <StyledPaper>
              {props.boxname}
            </StyledPaper>
          </Grid>

          
          <Droppable droppableId={props.boxname}>
              {(provided, snapshot) => (
                  
            
          <Grid item xs={9} className='highlightOn'>
                <Paper className={classes.paper} >
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.wrapper}
                    spacing={1}
                >
                  <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.instances[0]._id}
                        draggableId={item.instances[0]._id}
                        index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}>
                                <img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>
                                <span>{item.instances.length}</span>
                            </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  
                </Grid>
                </Paper>
          </Grid>
          
          )}          
          </Droppable>

          </Grid>
          </RootDiv>
        
        
      );
    }

  export default Box