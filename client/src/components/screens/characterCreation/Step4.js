import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AttributeBox from "./AttributeBox";
import Divider from '@material-ui/core/Divider'

const Step4 = props => {
  return (
    <React.Fragment>
      <Typography variant="h6" style={{textAlign:'center'}}>
        Rozdziel atrybuty swojej postaci wedle uznania
      </Typography>
      <Divider style={{width: '90%'}}/>
      <Typography variant="body2" style={{margin: '1rem 0'}}>
        Dostępne punkty: {props.attributePool}/3
      </Typography>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
        wrap="nowrap"
      >
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="strength"
          attributeName="Siła [S]"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="dexterity"
          attributeName="Zręczność [Z]"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="magic"
          attributeName="Magia [M]"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="endurance"
          attributeName="Wytrzymałość [W]"
        />
      </Grid>
      <Typography variant="caption" style={{textAlign: 'center', marginTop: '1rem'}}>
        Atrybuty będą miały wpływ na dostępne dla Ciebie misje!
      </Typography>
    </React.Fragment>
  );
};

export default Step4;