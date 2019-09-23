import React, {useState} from 'react';
import { DropTarget } from 'react-drag-drop-container';
import TypeBoxItem from './TypeBoxItem'; 
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
    const items = props.items //from backend

    return (
          <div className={classes.root}>
          
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
            <Paper className={classes.paper}>
              {props.boxname}
            </Paper>
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
                    const quantity = 5;
                    const imgData = {imgSrc, quantity}
                    return (
                      
                      <TypeBoxItem key={item._id} kill={kill} boxname={props.boxname} item={item}>
                        {imgData}
                      </TypeBoxItem>
                      
                    )
                })}
                </Grid>
                </Paper>
          </Grid>
          </Grid>
            
          </DropTarget>
          
          </div>
        
        
      );
    }

  export default UserTypeBox