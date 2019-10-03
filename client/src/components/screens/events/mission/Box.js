import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'; 
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'
import { Paper } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';



const RootDiv = styled.div`
    flex-grow: 1;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`




const Item = styled.div`

  user-select: none;
  padding: 0.5rem;
  margin: 0 0.2rem 0 0;
  line-height: 1.5;
  border-radius: 1px;
  border: 1px ${props => (props.isDragging ? 'dashed #000' : 'solid #ddd')};
  background: ${(props) => props.isDragging ? 'rgb(230, 220, 141)' : 'white'}
`

const Clone = styled(Item)`
  ~ div {
    transform: none!important;
  }
`

const StyledPaper = styled(Paper)`
    min-height: 75px;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
`

const BoxList = styled.div`
  background: ${(props) => props.isDraggingOver ? 'rgb(230, 220, 141)' : 'white'};
  padding: grid;
  min-height: 4rem;
  
  width: 96%;
  height: 96%;
  display: flex;
  align-text: flex-start;
  justify-content: flex-start;
  margin: 0.5rem 

`

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


const Box = (props) => {

  

  

    
    //convert client items to stack view
    const items = convertToStack(props.items, props.targetKey) //from backend

    return (
      <RootDiv >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={3}>
            <img style={{height: 70, width: 70}} src={props.boxIcon}/>
          </Grid>

          <Grid item xs={9}>
            <StyledPaper>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Droppable direction="horizontal" droppableId={props.boxname} isDropDisabled={props.draggableProperty === props.boxname ? true : false} >
                  {(provided, snapshot) => (
                    <BoxList
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {items.length ? (items.map((item, index) => {
                        //https://codesandbox.io/s/q3717y1jq4
                        return(
                          <Draggable
                            key={item.model._id}
                            draggableId={item.instances[0]._id}
                            index={index}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                              
                                  <Item
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={
                                        provided.draggableProps.style
                                      }
                                      isDragging = {snapshot.isDragging}
                                    >
                                    
                                    <img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>
                                    {!snapshot.isDragging && (<span>{item.instances.length}</span>)}

                                  </Item>

                                  {snapshot.isDragging && (
                                    <Clone>
                                      <img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>
                                      <span>{item.instances.length - 1}</span>
                                    </Clone>
                                  )}
                                  
                                </React.Fragment>
                            )}
                          </Draggable>
                      )})):(<span style={{justifyContent: 'center'}}>Przeciągnij tutaj!</span>)}
                      
                    </BoxList>
                    
                  )}          
                </Droppable>
              </Grid>
            </StyledPaper>
          </Grid>
        </Grid>
      </RootDiv> 
    );
  }

  export default Box