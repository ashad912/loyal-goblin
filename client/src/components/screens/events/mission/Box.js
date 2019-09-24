import React, {useState} from 'react';
import { DropTarget } from 'react-drag-drop-container';
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

const convertToStack = (itemsToConvert) => {
  let itemModels = []
  itemsToConvert.forEach((itemToConvert) => {
    //NOTE: filter returns new array - if for itemModels get zero length, it is new name
    if(itemModels.filter(itemModel => itemModel.name === itemToConvert.model.name).length === 0){
      itemModels = [...itemModels, itemToConvert.model]
    }
  })

  let itemObjects = []
  itemModels.forEach((itemModel) => {
    let quantity = 0
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

const UserTypeBox = (props) => {

    //const [highlighted, setHighlighted] = useState(false)
  

    const handleDrop = (e) => {
      //console.log(e)
      //props.setHighlighted(false)
      const item = e.dragData

      props.addItem(item, props.targetKey)
    };

    const kill = (id) => {
      props.deleteItem(id, props.targetKey)
    };

    
    
    
    const classes = useStyles();
    const items = convertToStack(props.items) //from backend

    return (
          <RootDiv >
          
          <DropTarget
            onHit={handleDrop}
            /*onDragEnter={() => props.setHighlighted(true)}*/
            /*onDragLeave={() => props.setHighlighted(false)}*/
            targetKey="boxItem"
          >
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
                  {items.map((item, index) => {
                    const imgSrc = item.model.imgSrc
                    const quantity = item.instances.length;
                    const imgData = {imgSrc, quantity}
                    return (
                      
                      <BoxItem key={item.model._id} kill={kill} boxname={props.boxname} item={item.instances[0]}>
                        {imgData}
                      </BoxItem>
                      
                    )
                })}
                </Grid>
                </Paper>
          </Grid>
          </Grid>
            
          </DropTarget>
          
          </RootDiv>
        
        
      );
    }

  export default UserTypeBox