import React, {useState} from 'react';
import { DropTarget } from 'react-drag-drop-container';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TypeBoxItem from './TypeBoxItem'; 
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'



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

const Box = (props) => {

    const [highlighted, setHighlighted] = useState(false)
  

    const handleDrop = (e) => {
      console.log(e)
      setHighlighted(false)
      const item = e.dragData
      props.addItem(item, props.targetKey)
    };

    const kill = (id) => {
      props.deleteItem(id, props.targetKey)
    };
    

   

    const items = props.items //from backend

    return (
      
          <DropTarget
            onHit={handleDrop}
            /*onDragEnter={() => setHighlighted(true)}
            onDragLeave={() => setHighlighted(false)}*/
            targetKey="boxItem"
            dropData={{name: props.name}}
          >
            <StyledBox highlighted={highlighted}>
              <Grid
                container
                xs={12}
                direction="row"
                justify="center"
                alignItems="flex-start"
              >
                {items.map((item, index) => {
                  const imgSrc = item.model.imgSrc
                  const quantity = 5;
                  const imgData = {imgSrc, quantity}
                  return (
                    
                    <TypeBoxItem key={item._id} kill={kill} boxname={props.boxname} item={item}>
                      {imgData}
                    </TypeBoxItem>
                    
                  )
                })}
                </Grid>
              </StyledBox>
            </DropTarget>
        
      );
    }

  export default Box