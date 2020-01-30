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
      <img src={props.attributeIcon} style={{width: '2rem', paddingTop: '0.4rem'}}/>
      <Typography variant="h5" style={{color: fontColor}}>{props.attributeValue + props.attributeModifier}</Typography>
      <Typography variant="caption">{props.attributeName}</Typography>
    </Paper>
  )
}

export default Attribute