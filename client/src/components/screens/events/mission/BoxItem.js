import React from 'react';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import styled from 'styled-components'

/*
    BoxItem - a thing that appears in a box, after you drag something into the box
*/

const StyledBoxItemComponent = styled.div`
`;

const StyledBoxItemOuter = styled(StyledBoxItemComponent)`
  border-top: none;
  min-width: 55px;
  max-width: 55px;
  overflow: hidden;
`;

const StyledBoxItemInside = styled(StyledBoxItemComponent)`
  color: black;
  border: 1px solid black;
  padding: 2px;
  margin: 2px;
`;

const TypeBoxItem = (props) => {
    
  
    const deleteMe = () => {
      props.kill(props.item._id);
    };
  
      /*
        Notice how these are wrapped in a DragDropContainer (so you can drag them) AND
        in a DropTarget (enabling you to rearrange items in the box by dragging them on
        top of each other)
      */
      

      return (
        <StyledBoxItemComponent>
          <DragDropContainer
              targetKey="boxItem"
              dragData={props.item}
              /*customDragElement={props.customDragElement}*/
              onDrop={deleteMe}
              disappearDraggedElement={false}
              dragClone={true}
              //dragHandleClassName="grabber" //doesnt work on mobile

              //dragHandleClassName - specify that you can only drag a box by grabbing the 'x'.
              //disappearDraggedElement - makes the elements in the boxes disappear when you drag them, so they no longer take up any space.
              
            >
                <StyledBoxItemOuter>
                  <StyledBoxItemInside>
                    <img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${props.children.imgSrc}`)} alt='icon'/>
                    <span>{props.children.quantity}</span>
                  </StyledBoxItemInside>
                </StyledBoxItemOuter>
          </DragDropContainer>
        
        </StyledBoxItemComponent>
      );
    
  }

  export default TypeBoxItem