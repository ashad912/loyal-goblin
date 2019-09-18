import React from 'react'
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

const Attribute = (props) => {
  return (
    <Paper square style={{width:'100%'}}>
      <Typography variant="subtitle1">{props.attributeName}</Typography>
      <Typography variant="h5">{props.attributeValue}</Typography>
    </Paper>
  )
}

export default Attribute