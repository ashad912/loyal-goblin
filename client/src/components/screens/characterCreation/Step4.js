import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AttributeBox from "./AttributeBox";

const Step4 = props => {
  return (
    <React.Fragment>
      <Typography variant="h6">
        Rozdziel atrybuty swojej postaci wedle uznania
      </Typography>
      <Typography variant="body2">
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
          attribute="str"
          attributeName="Siła"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="dex"
          attributeName="Zręczność"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="mag"
          attributeName="Magia"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="end"
          attributeName="Wytrzymałość"
        />
      </Grid>
      <Typography variant="caption" style={{textAlign: 'center'}}>
        Możesz rozdzielić je później w swojej karcie postaci!
      </Typography>
    </React.Fragment>
  );
};

export default Step4;