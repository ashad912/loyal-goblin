import React from 'react'
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

const Attribute = (props) => {
  let fontColor = 'inherit'
  if(props.attributeModifier > 0){
    fontColor = 'rgb(68, 192, 0)'
  }else if(props.attributeModifier < 0){
    fontColor = 'rgb(178, 34, 34)'
  }
  

  return (
    <Paper square style={{width:'100%'}}>
      <Typography variant="subtitle1">{props.attributeName}</Typography>
      <Typography variant="h5" style={{color: fontColor}}>{props.attributeValue + props.attributeModifier}</Typography>
    </Paper>
  )
}

export default Attribute