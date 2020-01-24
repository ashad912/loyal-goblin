import React from 'react'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const AttributeBox = ({value, attrType, attrTypeText, changeValue}) => {

  return (
    <Grid container spacing={4} style={{width: '30%'}}>
        <Grid item xs={5}>
            <Button variant="contained" color="secondary" onClick={(e) => changeValue(e, attrType, -1)}>-</Button>
        </Grid>
        <Grid item xs={2}>
            <TextField type="tel" value={value} onChange={(e) => changeValue(e, attrType)} label={attrTypeText} inputProps={{style: {textAlign: 'center'}}}/>
        </Grid>
        <Grid item xs={5}>
            <Button variant="contained" color="primary" onClick={(e) => changeValue(e, attrType, 1)}>+</Button>
        </Grid>
    </Grid>
  )
}

export default AttributeBox
