import React from 'react';
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'; 

import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';

import {palette, itemsPath} from 'utils/definitions'
import {PintoTypography} from 'utils/fonts'


const RootDiv = styled.div`
    flex-grow: 1;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`


const Item = styled.div`
  user-select: none;
  padding: 0.2rem;
  margin: 0.2rem 0rem;
  border: 1px solid ${props => (props.isDragging ? palette.background.grey : palette.background.grey)};
  background: ${(props) => props.isDragging ? palette.background.equipped : 'white'};
  &:active{
    background: ${palette.background.equipped};
  }
`
//~ preceded - poprzedzony
const Clone = styled(Item)`
  ~ div {
    transform: none!important;
  }
`

const StyledPaper = styled(Paper)`
    min-height: 3rem;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
    border: 1px solid ${palette.background.grey};
`

const BoxList = styled.div`
  background: ${(props) => props.isDraggingOver ? palette.background.equipped : 'white'};
  min-height: 3rem;
  align-items: center;
  width: 96%;
  height: 96%;
  display: flex;
  align-text: flex-start;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0.5rem ;

`

const PlaceholderText = styled.div`
  justify-content: center;
  width: 100%;
  height: auto;
`
const convertToStack = (itemsToConvert) => {
  let itemModels = []
  
  itemsToConvert.forEach((itemToConvert) => {
    //NOTE: filter returns new array - if for itemModels gets zero length, it is new name
    if(itemModels.filter(itemModel => itemModel.name === itemToConvert.itemModel.name).length === 0){
      itemModels = [...itemModels, itemToConvert.itemModel]
    }
  })

  let itemObjects = []
  itemModels.forEach((itemModel) => {
    let instanceItemsIds = []
    itemsToConvert.forEach((itemToConvert) => {
      if(itemModel.name === itemToConvert.itemModel.name){
        instanceItemsIds = [...instanceItemsIds, itemToConvert._id]
      }
    })
    const itemObject = {model: itemModel, instancesIds: instanceItemsIds}
    itemObjects = [...itemObjects, itemObject]
  })
  return itemObjects
}


const Box = (props) => {

    const items = convertToStack(props.items) //from backend
    
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
            {props.image}
          </Grid>

          <Grid item xs={9}>
            <StyledPaper
              elevation={0}
              variant="outlined"
              square
            >
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
                            draggableId={item.instancesIds[0]}
                            index={index}
                            shouldRespectForcePress={true}>
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
                                    
                                    <img style={{height: '2rem', width: '2rem'}} src={`${itemsPath}${item.model.imgSrc}`} alt='icon'/>
                                    {!snapshot.isDragging && (<span><PintoTypography display="inline">{item.instancesIds.length}</PintoTypography></span>)}

                                  </Item>

                                  {snapshot.isDragging && (
                                    <Clone>
                                      <img style={{height: '2rem', width: '2rem'}} src={`${itemsPath}${item.model.imgSrc}`} alt='icon'/>
                                      <span><PintoTypography display="inline">{item.instancesIds.length - 1}</PintoTypography></span>
                                    </Clone>
                                  )}
                                  
                                </React.Fragment>
                            )}
                          </Draggable>
                      )})):(
                        <PlaceholderText>
                          <PintoTypography>Przeciągnij tutaj!</PintoTypography>
                        </PlaceholderText>
                      )}
                      
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